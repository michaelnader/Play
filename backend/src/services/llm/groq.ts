import Groq from "groq-sdk";
import { config } from "../../config.js";
import { HttpError } from "../../lib/httpError.js";

let _client: Groq | null = null;

function client(): Groq {
  if (!config.groq.apiKey) {
    throw new HttpError(
      503,
      "llm_unconfigured",
      "GROQ_API_KEY is not set. Add it to backend/.env and restart the server."
    );
  }
  if (!_client) _client = new Groq({ apiKey: config.groq.apiKey });
  return _client;
}

export type ChatTurn = { role: "system" | "user" | "assistant"; content: string };

export type CompleteJSONOptions = {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export async function completeJSON<T>(opts: CompleteJSONOptions): Promise<T> {
  const res = await client().chat.completions.create({
    model: opts.model ?? config.groq.model,
    response_format: { type: "json_object" },
    temperature: opts.temperature ?? 0.8,
    max_completion_tokens: opts.maxTokens ?? 1500,
    top_p: 1,
    stream: false,
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
  });

  const raw = res.choices[0]?.message?.content?.trim();
  if (!raw) {
    throw new HttpError(502, "llm_empty_response", "Model returned no content");
  }

  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    throw new HttpError(502, "llm_invalid_json", "Model output was not valid JSON", {
      raw,
      cause: (e as Error).message,
    });
  }
}

export type CompleteJSONWithHistoryOptions = {
  system: string;
  history: ChatTurn[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export async function completeJSONWithHistory<T>(
  opts: CompleteJSONWithHistoryOptions
): Promise<T> {
  const res = await client().chat.completions.create({
    model: opts.model ?? config.groq.model,
    response_format: { type: "json_object" },
    temperature: opts.temperature ?? 0.7,
    max_completion_tokens: opts.maxTokens ?? 1000,
    top_p: 1,
    stream: false,
    messages: [
      { role: "system", content: opts.system },
      ...opts.history.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  const raw = res.choices[0]?.message?.content?.trim();
  if (!raw) {
    throw new HttpError(502, "llm_empty_response", "Model returned no content");
  }

  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    throw new HttpError(502, "llm_invalid_json", "Model output was not valid JSON", {
      raw,
      cause: (e as Error).message,
    });
  }
}
