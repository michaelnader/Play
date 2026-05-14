import path from "node:path";
import fs from "node:fs";
import { config } from "../../config.js";
import { newId } from "../../lib/id.js";

const ROOT = path.resolve(config.storage.path);
fs.mkdirSync(ROOT, { recursive: true });

export type SavedImage = {
  imageId: string;
  fileName: string;
  publicUrl: string;
};

function extFromMime(mimeType: string): string {
  if (mimeType.includes("jpeg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  return "png";
}

export function saveImage(messageId: string, data: Buffer, mimeType: string): SavedImage {
  const dir = path.join(ROOT, messageId);
  fs.mkdirSync(dir, { recursive: true });

  const imageId = newId("img");
  const ext = extFromMime(mimeType);
  const fileName = `${imageId}.${ext}`;
  const fullPath = path.join(dir, fileName);

  fs.writeFileSync(fullPath, data);

  return {
    imageId,
    fileName,
    publicUrl: `/api/files/${messageId}/${fileName}`,
  };
}

export function resolveStoredFile(messageId: string, fileName: string): string | null {
  // Defend against path traversal — only allow simple file names.
  if (!/^[a-zA-Z0-9_]+\.(png|jpg|jpeg|webp)$/.test(fileName)) return null;
  if (!/^[a-zA-Z0-9_]+$/.test(messageId)) return null;

  const fullPath = path.join(ROOT, messageId, fileName);
  if (!fullPath.startsWith(ROOT + path.sep) && fullPath !== ROOT) return null;
  if (!fs.existsSync(fullPath)) return null;
  return fullPath;
}

export function mimeFromExt(fileName: string): string {
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
  if (fileName.endsWith(".webp")) return "image/webp";
  return "image/png";
}
