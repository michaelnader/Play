import { config } from "../../config.js";
import { generateImage as nanoBananaGen } from "./nanoBanana.js";
import { generateImage as pollinationsGen } from "./pollinations.js";
import type { GenerateImageOptions, GeneratedImage } from "./nanoBanana.js";

export type { GenerateImageOptions, GeneratedImage } from "./nanoBanana.js";

export async function generateImage(opts: GenerateImageOptions): Promise<GeneratedImage> {
  const provider = config.image.provider;

  if (provider === "nano-banana") {
    try {
      return await nanoBananaGen(opts);
    } catch (err) {
      console.warn("[image] nano-banana failed, falling back to pollinations:", err);
      return await pollinationsGen(opts);
    }
  }

  // default: pollinations
  return await pollinationsGen(opts);
}
