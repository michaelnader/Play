import { completeJSON } from "../llm/groq.js";
import { CAPTION_SYSTEM_PROMPT } from "../llm/prompts.js";
import { captionResultSchema, type CaptionResult } from "../llm/schemas.js";
import type { AttachmentBlock, PipelineResult } from "./index.js";

export async function runCaptionPipeline(userPrompt: string): Promise<PipelineResult> {
  const raw = await completeJSON<unknown>({
    system: CAPTION_SYSTEM_PROMPT,
    user: userPrompt,
    temperature: 0.9,
    maxTokens: 1500,
  });

  const parsed = captionResultSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      content:
        "I generated something but it didn't match the expected format — please try again with a bit more detail about your post.",
      attachments: null,
    };
  }

  const data: CaptionResult = parsed.data;

  if (data.captions.length === 0) {
    return { content: data.intro, attachments: null };
  }

  const attachments: AttachmentBlock[] = data.captions.map((c) => ({
    kind: "caption" as const,
    platform: c.platform,
    text: c.text,
    hashtags: c.hashtags,
  }));

  return {
    content: data.intro,
    attachments,
  };
}
