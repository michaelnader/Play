import { completeJSON, completeJSONWithHistory } from "../llm/groq.js";
import { config } from "../../config.js";
import {
  ALL_IN_ONE_SYSTEM_PROMPT,
  ALL_IN_ONE_INTAKE_SYSTEM_PROMPT,
} from "../llm/prompts.js";
import {
  allInOneResultSchema,
  intakeResultSchema,
  type AllInOneResult,
  type AllInOnePost,
} from "../llm/schemas.js";
import { generateImage } from "../image/index.js";
import { saveImage } from "../image/storage.js";
import { overlayLogo } from "../image/overlay.js";
import type {
  AttachmentBlock,
  PipelineContext,
  PipelineResult,
  FileRef,
} from "./index.js";

type RenderedPost = {
  post: AllInOnePost;
  imageUrl: string | null;
};

async function renderPost(
  post: AllInOnePost,
  parentMsgId: string,
  logoFile: FileRef | undefined,
  userId: string
): Promise<RenderedPost> {
  try {
    const aspectForGen =
      post.aspect_ratio === "4:5"
        ? "3:4"
        : (post.aspect_ratio as "1:1" | "9:16" | "16:9" | "3:4" | "4:3");

    const image = await generateImage({
      prompt: post.image_prompt,
      aspectRatio: aspectForGen,
    });

    let finalImageData = image.data;
    if (logoFile) {
      try {
        finalImageData = await overlayLogo({
          imageBuffer: image.data,
          logoFileUrl: logoFile.url,
          userId,
        });
      } catch (err) {
        console.warn("[all] logo overlay failed, using image without logo:", err);
      }
    }

    // Save under the real assistant message id — saveImage assigns each file a
    // unique imageId, so two posts won't collide. Using the real msg id is what
    // lets /api/files/:msgId/:fileName pass its ownership check.
    const saved = saveImage(parentMsgId, finalImageData, image.mimeType);
    return { post, imageUrl: saved.publicUrl };
  } catch (err) {
    console.error("[all] image generation failed for post:", post.title, err);
    return { post, imageUrl: null };
  }
}

export async function runAllInOnePipeline(
  userPrompt: string,
  assistantMsgId: string,
  ctx: PipelineContext
): Promise<PipelineResult> {
  // Step 0 — Intake: chat with the user until they explicitly green-light generation.
  // The model sees the full conversation history and either asks a follow-up
  // (status: "ask") or returns a consolidated brief (status: "execute").
  const intakeRaw = await completeJSONWithHistory<unknown>({
    system: ALL_IN_ONE_INTAKE_SYSTEM_PROMPT,
    history: ctx.history,
    model: config.groq.model,
    temperature: 0.6,
    maxTokens: 700,
  });

  const intakeParsed = intakeResultSchema.safeParse(intakeRaw);
  if (!intakeParsed.success) {
    return {
      content:
        "Hey — tell me a bit about what you're posting about: the business, who it's for, and the vibe you want?",
      attachments: null,
    };
  }

  if (intakeParsed.data.status === "ask") {
    return { content: intakeParsed.data.message, attachments: null };
  }

  // status === "execute": use the consolidated brief the intake step produced,
  // falling back to the current user prompt if for some reason it's missing.
  const generationInput = intakeParsed.data.brief?.trim() || userPrompt;

  // Step 1: One LLM call produces the plan + both post briefs + both captions.
  const raw = await completeJSON<unknown>({
    system: ALL_IN_ONE_SYSTEM_PROMPT,
    user: generationInput,
    model: config.groq.model, // smarter 70B model — orchestrating plan + 2 posts
    temperature: 0.85,
    maxTokens: 3500,
  });

  const parsed = allInOneResultSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      content:
        "I drafted a starter pack but it didn't match the expected format — try giving more detail about your business (what you sell, who it's for, the vibe).",
      attachments: null,
    };
  }

  const data: AllInOneResult = parsed.data;

  if (data.posts.length !== 2) {
    return { content: data.intro, attachments: null };
  }

  // Step 2: Generate both images in parallel (with optional logo overlay).
  const logoFile = ctx.files.find(
    (f) => f.mimeType.startsWith("image/") && !f.mimeType.includes("gif")
  );

  const rendered = await Promise.all(
    data.posts.map((p) => renderPost(p, assistantMsgId, logoFile, ctx.userId))
  );

  // Step 3: Assemble attachments — plan first, then for each post: image card + caption card.
  const attachments: AttachmentBlock[] = [
    {
      kind: "outline" as const,
      title: data.plan.title,
      bullets: data.plan.bullets,
    },
  ];

  for (const { post, imageUrl } of rendered) {
    if (imageUrl) {
      attachments.push({
        kind: "reel" as const,
        title: post.title,
        caption: post.caption_overlay,
        image: imageUrl,
      });
    }
    attachments.push({
      kind: "caption" as const,
      platform: post.platform,
      text: post.caption,
      hashtags: post.hashtags,
    });
  }

  return {
    content: data.intro,
    attachments,
  };
}
