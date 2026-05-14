import "dotenv/config";

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  databasePath: process.env.DATABASE_PATH ?? "./data/elama.db",
  accessTokenSecret: required("ACCESS_TOKEN_SECRET"),
  refreshTokenSecret: required("REFRESH_TOKEN_SECRET"),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  groq: {
    apiKey: process.env.GROQ_API_KEY ?? "",
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    fastModel: process.env.GROQ_FAST_MODEL ?? "llama-3.1-8b-instant",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? "",
    imageModel: process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image",
  },
  image: {
    // "pollinations" (truly free, zero auth) or "nano-banana" (Gemini, requires billing).
    provider: (process.env.IMAGE_PROVIDER ?? "pollinations") as "pollinations" | "nano-banana",
  },
  storage: {
    path: process.env.STORAGE_PATH ?? "./data/generated",
  },
};

if (config.accessTokenSecret.length < 32 || config.refreshTokenSecret.length < 32) {
  console.warn("[config] Token secrets should be at least 32 chars in production.");
}
