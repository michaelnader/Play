import { runCaptionPipeline } from "./caption.js";
import { runStrategyPipeline } from "./strategy.js";
import { runReelPipeline } from "./reel.js";
import { runAllInOnePipeline } from "./all.js";

export type AttachmentBlock =
  | { kind: "reel"; title: string; caption: string; image: string }
  | { kind: "caption"; platform: string; text: string; hashtags: string[] }
  | { kind: "hashtags"; tags: string[] }
  | { kind: "outline"; title: string; bullets: string[] };

export type PipelineResult = {
  content: string;
  attachments: AttachmentBlock[] | null;
};

export type ChatMode = "all" | "reel" | "caption" | "strategy";

export type FileRef = {
  fileId: string;
  fileName: string;
  url: string;
  mimeType: string;
};

export type PipelineContext = {
  assistantMsgId: string;
  userId: string;
  files: FileRef[];
};

function buildBrandContext(userPrompt: string, files: FileRef[]): string {
  const parts: string[] = [userPrompt];

  const imageFiles = files.filter((f) => f.mimeType.startsWith("image/"));
  const docFiles = files.filter(
    (f) => f.mimeType.startsWith("text/") || f.mimeType === "application/pdf"
  );

  if (imageFiles.length > 0) {
    parts.push(
      `\n\n[The user attached ${imageFiles.length} image(s): ${imageFiles
        .map((f) => `"${f.fileName}"`)
        .join(", ")}. If any is a brand logo, incorporate it as directed.]`
    );
  }

  if (docFiles.length > 0) {
    for (const doc of docFiles) {
      try {
        const fs = require("node:fs");
        const path = require("node:path");
        const uploadDir = path.resolve("./data/uploads");
        const parts2 = doc.url.split("/");
        const safeName = parts2[parts2.length - 1];
        const userId = parts2[parts2.length - 2];
        const filePath = path.join(uploadDir, userId, safeName);
        if (fs.existsSync(filePath) && doc.mimeType.startsWith("text/")) {
          const content = fs.readFileSync(filePath, "utf-8").slice(0, 4000);
          parts.push(`\n\n[Brand document "${doc.fileName}":\n${content}\n]`);
        }
      } catch {
        // ignore unreadable files
      }
    }
  }

  return parts.join("");
}

const NOT_IMPLEMENTED_MSG = (mode: ChatMode) =>
  `${mode} mode isn't wired up yet — switch to Caption, Strategy, or Image for now.`;

export async function runPipeline(
  mode: ChatMode,
  userPrompt: string,
  ctx: PipelineContext
): Promise<PipelineResult> {
  const enrichedPrompt = buildBrandContext(userPrompt, ctx.files);

  switch (mode) {
    case "caption":
      return runCaptionPipeline(enrichedPrompt);
    case "strategy":
      return runStrategyPipeline(enrichedPrompt);
    case "reel":
      return runReelPipeline(enrichedPrompt, ctx.assistantMsgId, ctx);
    case "all":
      return runAllInOnePipeline(enrichedPrompt, ctx.assistantMsgId, ctx);
    default:
      return { content: NOT_IMPLEMENTED_MSG(mode as ChatMode), attachments: null };
  }
}
