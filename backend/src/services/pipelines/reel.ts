import { completeJSON } from "../llm/groq.js";
import { config } from "../../config.js";
import { REEL_BRIEF_SYSTEM_PROMPT } from "../llm/prompts.js";
import { reelBriefSchema, type ReelBrief } from "../llm/schemas.js";
import { generateImage } from "../image/index.js";
import { saveImage } from "../image/storage.js";
import { overlayLogo } from "../image/overlay.js";
import type { AttachmentBlock, PipelineContext, PipelineResult } from "./index.js";

export async function runReelPipeline(
  userPrompt: string,
  assistantMsgId: string,
  ctx: PipelineContext
): Promise<PipelineResult> {
  // Step 1: Llama 8B turns the user prompt into a structured image brief.
  const raw = await completeJSON<unknown>({
    system: REEL_BRIEF_SYSTEM_PROMPT,
    user: userPrompt,
    model: config.groq.fastModel,
    temperature: 0.8,
    maxTokens: 600,
  });

  const parsed = reelBriefSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      content:
        "I couldn't shape that into a clean image brief — try giving more detail (subject, vibe, where it's set).",
      attachments: null,
    };
  }

  const brief: ReelBrief = parsed.data;

  if (!brief.image_prompt.trim()) {
    return { content: brief.intro, attachments: null };
  }

  // Step 2: Generate the image.
  const aspectForGen =
    brief.aspect_ratio === "4:5" ? "3:4" : (brief.aspect_ratio as "1:1" | "9:16" | "16:9" | "3:4" | "4:3");
  const image = await generateImage({
    prompt: brief.image_prompt,
    aspectRatio: aspectForGen,
  });

  // Step 3: Overlay the logo if the user attached one.
  let finalImageData = image.data;
  const logoFile = ctx.files.find(
    (f) => f.mimeType.startsWith("image/") && !f.mimeType.includes("gif")
  );
  if (logoFile) {
    try {
      finalImageData = await overlayLogo({
        imageBuffer: image.data,
        logoFileUrl: logoFile.url,
        userId: ctx.userId,
      });
    } catch (err) {
      console.warn("[reel] logo overlay failed, using image without logo:", err);
    }
  }

  // Step 4: Persist and assemble the attachment.
  const saved = saveImage(assistantMsgId, finalImageData, image.mimeType);

  const attachments: AttachmentBlock[] = [
    {
      kind: "reel" as const,
      title: brief.title,
      caption: brief.caption_overlay,
      image: saved.publicUrl,
    },
  ];

  return {
    content: brief.intro,
    attachments,
  };
}
