import { Router } from "express";
import { z } from "zod";
import { db, type ChatRow, type MessageRow } from "../db.js";
import { requireAuth } from "../auth.js";
import { newId } from "../lib/id.js";
import { HttpError } from "../lib/httpError.js";
import { validateBody } from "../lib/validate.js";
import { runPipeline, type ChatMode } from "../services/pipelines/index.js";

const router = Router();

router.use(requireAuth);

const createChatSchema = z.object({
  title: z.string().min(1).max(120).default("New chat"),
  mode: z.enum(["all", "reel", "caption", "strategy"]).default("all"),
});

const updateChatSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  mode: z.enum(["all", "reel", "caption", "strategy"]).optional(),
});

const fileRefSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  url: z.string(),
  mimeType: z.string(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  files: z.array(fileRefSchema).max(5).optional(),
});

function rowToChat(r: ChatRow) {
  return {
    id: r.id,
    title: r.title,
    mode: r.mode,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToMessage(r: MessageRow) {
  return {
    id: r.id,
    chatId: r.chat_id,
    role: r.role,
    content: r.content,
    attachments: r.attachments ? JSON.parse(r.attachments) : null,
    createdAt: r.created_at,
  };
}

function findChat(id: string, userId: string): ChatRow {
  const row = db
    .prepare(`SELECT * FROM chats WHERE id = ? AND user_id = ?`)
    .get(id, userId) as ChatRow | undefined;
  if (!row) throw new HttpError(404, "chat_not_found", "Chat not found");
  return row;
}

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT * FROM chats WHERE user_id = ? ORDER BY datetime(updated_at) DESC LIMIT 100`
    )
    .all(req.user!.id) as ChatRow[];
  res.json({ chats: rows.map(rowToChat) });
});

router.post("/", validateBody(createChatSchema), (req, res) => {
  const { title, mode } = req.body as z.infer<typeof createChatSchema>;
  const id = newId("cht");
  db.prepare(`INSERT INTO chats (id, user_id, title, mode) VALUES (?, ?, ?, ?)`).run(
    id,
    req.user!.id,
    title,
    mode
  );
  const row = db.prepare(`SELECT * FROM chats WHERE id = ?`).get(id) as ChatRow;
  res.status(201).json({ chat: rowToChat(row) });
});

router.get("/:id", (req, res) => {
  const chat = findChat(req.params.id!, req.user!.id);
  const messages = db
    .prepare(`SELECT * FROM messages WHERE chat_id = ? ORDER BY datetime(created_at) ASC`)
    .all(chat.id) as MessageRow[];
  res.json({ chat: rowToChat(chat), messages: messages.map(rowToMessage) });
});

router.patch("/:id", validateBody(updateChatSchema), (req, res) => {
  const chat = findChat(req.params.id!, req.user!.id);
  const { title, mode } = req.body as z.infer<typeof updateChatSchema>;
  db.prepare(
    `UPDATE chats SET title = COALESCE(?, title), mode = COALESCE(?, mode), updated_at = datetime('now') WHERE id = ?`
  ).run(title ?? null, mode ?? null, chat.id);
  const row = db.prepare(`SELECT * FROM chats WHERE id = ?`).get(chat.id) as ChatRow;
  res.json({ chat: rowToChat(row) });
});

router.delete("/:id", (req, res) => {
  const chat = findChat(req.params.id!, req.user!.id);
  db.prepare(`DELETE FROM chats WHERE id = ?`).run(chat.id);
  res.json({ ok: true });
});

router.post("/:id/messages", validateBody(sendMessageSchema), async (req, res, next) => {
  try {
    const chat = findChat(req.params.id!, req.user!.id);
    const { content, files } = req.body as z.infer<typeof sendMessageSchema>;

    const userMsgId = newId("msg");
    const assistantMsgId = newId("msg");

    db.prepare(
      `INSERT INTO messages (id, chat_id, role, content, attachments) VALUES (?, ?, 'user', ?, ?)`
    ).run(userMsgId, chat.id, content, files?.length ? JSON.stringify(files) : null);

    let reply: { content: string; attachments: unknown };
    try {
      const result = await runPipeline(chat.mode as ChatMode, content, {
        assistantMsgId,
        userId: req.user!.id,
        files: files ?? [],
      });
      reply = { content: result.content, attachments: result.attachments };
    } catch (err) {
      const message =
        err instanceof HttpError
          ? `(${err.code}) ${err.message}`
          : "Something went wrong while generating a response. Please try again.";
      console.error("[pipeline]", err);
      reply = { content: message, attachments: null };
    }

    db.prepare(
      `INSERT INTO messages (id, chat_id, role, content, attachments) VALUES (?, ?, 'assistant', ?, ?)`
    ).run(
      assistantMsgId,
      chat.id,
      reply.content,
      reply.attachments ? JSON.stringify(reply.attachments) : null
    );
    db.prepare(`UPDATE chats SET updated_at = datetime('now') WHERE id = ?`).run(chat.id);

    const rows = db
      .prepare(`SELECT * FROM messages WHERE id IN (?, ?) ORDER BY datetime(created_at) ASC`)
      .all(userMsgId, assistantMsgId) as MessageRow[];

    res.status(201).json({ messages: rows.map(rowToMessage) });
  } catch (err) {
    next(err);
  }
});

export default router;
