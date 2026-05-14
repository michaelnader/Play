import { Router } from "express";
import fs from "node:fs";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import { HttpError } from "../lib/httpError.js";
import { resolveStoredFile, mimeFromExt } from "../services/image/storage.js";

const router = Router();

router.use(requireAuth);

router.get("/:msgId/:fileName", (req, res, next) => {
  try {
    const { msgId, fileName } = req.params;
    if (!msgId || !fileName) throw new HttpError(404, "not_found", "File not found");

    // Ownership check: the requested message must belong to a chat owned by req.user.
    const row = db
      .prepare(
        `SELECT m.id FROM messages m
           JOIN chats c ON c.id = m.chat_id
          WHERE m.id = ? AND c.user_id = ?`
      )
      .get(msgId, req.user!.id) as { id: string } | undefined;
    if (!row) throw new HttpError(404, "not_found", "File not found");

    const fullPath = resolveStoredFile(msgId, fileName);
    if (!fullPath) throw new HttpError(404, "not_found", "File not found");

    res.setHeader("Content-Type", mimeFromExt(fileName));
    res.setHeader("Cache-Control", "private, max-age=31536000, immutable");
    fs.createReadStream(fullPath).pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
