import { GoogleGenAI, Modality } from "@google/genai";
import { config } from "../../config.js";
import { HttpError } from "../../lib/httpError.js";

let _client: GoogleGenAI | null = null;

function client(): GoogleGenAI {
  if (!config.gemini.apiKey) {
    throw new HttpError(
      503,
      "image_unconfigured",
      "GEMINI_API_KEY is not set. Add it to backend/.env and restart."
    );
  }
  if (!_client) _client = new GoogleGenAI({ apiKey: config.gemini.apiKey });
  return _client;
}

export type GenerateImageOptions = {
  prompt: string;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "3:4" | "4:3";
};

export type GeneratedImage = {
  data: Buffer;
  mimeType: string;
};

export async function generateImage(opts: GenerateImageOptions): Promise<GeneratedImage> {
  // Nano Banana supports "1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"
  // We coerce 4:5 (Instagram) → 3:4 since 4:5 isn't supported.
  const ratio = opts.aspectRatio === "4:5" ? "3:4" : opts.aspectRatio;

  const response = await client().models.generateContent({
    model: config.gemini.imageModel,
    contents: opts.prompt,
    config: {
      responseModalities: [Modality.IMAGE],
      imageConfig: { aspectRatio: ratio },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = (part as { inlineData?: { data?: string; mimeType?: string } }).inlineData;
    if (inline?.data) {
      return {
        data: Buffer.from(inline.data, "base64"),
        mimeType: inline.mimeType ?? "image/png",
      };
    }
  }

  throw new HttpError(
    502,
    "image_no_output",
    "Image generator returned no image. The prompt may have been blocked by safety filters."
  );
}
