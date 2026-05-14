import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const UPLOAD_DIR = path.resolve("./data/uploads");

export type OverlayLogoOptions = {
  imageBuffer: Buffer;
  logoFileUrl: string;
  userId: string;
  position?: "southeast" | "southwest" | "northeast" | "northwest";
  sizeRatio?: number;
  opacity?: number;
  padding?: number;
};

export async function overlayLogo(opts: OverlayLogoOptions): Promise<Buffer> {
  const {
    imageBuffer,
    logoFileUrl,
    userId,
    position = "southeast",
    sizeRatio = 0.12,
    opacity = 0.85,
    padding = 20,
  } = opts;

  // Resolve the logo file path from the URL
  // URL format: /api/uploads/<userId>/<safeName>
  const parts = logoFileUrl.split("/");
  const safeName = parts[parts.length - 1];
  if (!safeName) return imageBuffer;

  const logoPath = path.join(UPLOAD_DIR, userId, safeName);
  if (!fs.existsSync(logoPath)) return imageBuffer;

  const logoRaw = fs.readFileSync(logoPath);

  // Get generated image dimensions
  const imageMeta = await sharp(imageBuffer).metadata();
  const imgW = imageMeta.width ?? 720;

  // Resize logo to proportional size
  const logoTargetWidth = Math.round(imgW * sizeRatio);
  const logoResized = await sharp(logoRaw)
    .resize({ width: logoTargetWidth, fit: "inside" })
    .ensureAlpha(opacity)
    .toBuffer();

  // Map position to gravity
  const gravityMap = {
    southeast: "southeast",
    southwest: "southwest",
    northeast: "northeast",
    northwest: "northwest",
  } as const;

  const result = await sharp(imageBuffer)
    .composite([
      {
        input: logoResized,
        gravity: gravityMap[position],
        blend: "over" as const,
      },
    ])
    .toBuffer();

  return result;
}
