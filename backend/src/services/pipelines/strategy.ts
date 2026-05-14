import { completeJSON } from "../llm/groq.js";
import { STRATEGY_SYSTEM_PROMPT } from "../llm/prompts.js";
import { strategyResultSchema, type StrategyResult } from "../llm/schemas.js";
import type { AttachmentBlock, PipelineResult } from "./index.js";

export async function runStrategyPipeline(userPrompt: string): Promise<PipelineResult> {
  const raw = await completeJSON<unknown>({
    system: STRATEGY_SYSTEM_PROMPT,
    user: userPrompt,
    temperature: 0.7,
    maxTokens: 3000,
  });

  const parsed = strategyResultSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      content:
        "I generated a strategy but it didn't match the expected format — please try again with more details about your campaign goal, audience, and platforms.",
      attachments: null,
    };
  }

  const data: StrategyResult = parsed.data;

  if (data.sections.length === 0) {
    return { content: data.intro, attachments: null };
  }

  const attachments: AttachmentBlock[] = data.sections.map((s) => ({
    kind: "outline" as const,
    title: s.title,
    bullets: s.bullets,
  }));

  return {
    content: data.intro,
    attachments,
  };
}
