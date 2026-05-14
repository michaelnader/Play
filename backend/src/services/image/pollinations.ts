import { HttpError } from "../../lib/httpError.js";
import type { GenerateImageOptions, GeneratedImage } from "./nanoBanana.js";

const ASPECT_DIMENSIONS: Record<GenerateImageOptions["aspectRatio"], [number, number]> = {
  "1:1": [1024, 1024],
  "9:16": [720, 1280],
  "16:9": [1280, 720],
  "3:4": [768, 1024],
  "4:3": [1024, 768],
  "4:5": [768, 960],
};

export async function generateImage(opts: GenerateImageOptions): Promise<GeneratedImage> {
  const [width, height] = ASPECT_DIMENSIONS[opts.aspectRatio];
  const seed = Math.floor(Math.random() * 1_000_000_000);

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    model: "flux",
    nologo: "true",
    enhance: "false",
  });

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(opts.prompt)}?${params}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    throw new HttpError(
      502,
      "image_generation_failed",
      `Image generator returned ${res.status}. Try again in a moment.`
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  const data = Buffer.from(arrayBuffer);
  const mimeType = res.headers.get("content-type") ?? "image/jpeg";

  if (data.byteLength < 200) {
    throw new HttpError(
      502,
      "image_generation_failed",
      "Image generator returned empty data. Try again."
    );
  }

  return { data, mimeType };
}
