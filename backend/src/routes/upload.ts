import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { requireAuth } from "../auth.js";
import { newId } from "../lib/id.js";
import { HttpError } from "../lib/httpError.js";

const UPLOAD_DIR = path.resolve("./data/uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "text/markdown",
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "invalid_file_type", `File type ${file.mimetype} is not supported.`) as unknown as Error);
    }
  },
});

const router = Router();
router.use(requireAuth);

router.post("/", upload.single("file"), (req, res, next) => {
  try {
    const file = req.file;
    if (!file) throw new HttpError(400, "no_file", "No file was uploaded.");

    const fileId = newId("upl");
    const ext = path.extname(file.originalname).toLowerCase() || mimeToExt(file.mimetype);
    const safeName = `${fileId}${ext}`;

    const userDir = path.join(UPLOAD_DIR, req.user!.id);
    fs.mkdirSync(userDir, { recursive: true });
    fs.writeFileSync(path.join(userDir, safeName), file.buffer);

    res.status(201).json({
      fileId,
      fileName: file.originalname,
      safeName,
      url: `/api/uploads/${req.user!.id}/${safeName}`,
      mimeType: file.mimetype,
      size: file.size,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/:safeName", (req, res, next) => {
  try {
    const { userId, safeName } = req.params;
    if (!userId || !safeName) throw new HttpError(404, "not_found", "File not found");
    if (userId !== req.user!.id) throw new HttpError(404, "not_found", "File not found");

    if (!/^upl_[a-zA-Z0-9]+\.\w+$/.test(safeName!)) {
      throw new HttpError(404, "not_found", "File not found");
    }

    const filePath = path.join(UPLOAD_DIR, userId, safeName!);
    if (!filePath.startsWith(UPLOAD_DIR + path.sep)) throw new HttpError(404, "not_found", "File not found");
    if (!fs.existsSync(filePath)) throw new HttpError(404, "not_found", "File not found");

    const ext = path.extname(safeName!).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".md": "text/markdown",
    };
    res.setHeader("Content-Type", mimeMap[ext] ?? "application/octet-stream");
    res.setHeader("Cache-Control", "private, max-age=86400");
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    next(err);
  }
});

function mimeToExt(mime: string): string {
  if (mime.includes("png")) return ".png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return ".jpg";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("gif")) return ".gif";
  if (mime.includes("svg")) return ".svg";
  if (mime.includes("pdf")) return ".pdf";
  if (mime.includes("markdown")) return ".md";
  return ".txt";
}

export default router;
