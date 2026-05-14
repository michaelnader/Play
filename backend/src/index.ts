import express, { type ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { HttpError } from "./lib/httpError.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chats.js";
import filesRoutes from "./routes/files.js";
import uploadRoutes from "./routes/upload.js";
import "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, "../../"); // play/

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (config.corsOrigins.includes(origin)) return cb(null, true);
      cb(new HttpError(403, "cors_blocked", `Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: config.nodeEnv, time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/uploads", uploadRoutes);

// --- Frontend static serving ---
// Serves Play.html and its asset files (.jsx, .css, /uploads, etc.).
// Only matches non-/api paths thanks to the position below.
app.get("/", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "Play.html"));
});
app.use(
  express.static(FRONTEND_DIR, {
    index: false,
    extensions: ["html"],
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".jsx")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      }
    },
  })
);

app.use((req, _res, next) => {
  if (!req.path.startsWith("/api/")) {
    // Anything not matched by static and not an API call — fall back to the SPA.
    return next(new HttpError(404, "not_found", `Cannot ${req.method} ${req.originalUrl}`));
  }
  next(new HttpError(404, "not_found", `Cannot ${req.method} ${req.originalUrl}`));
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }
  console.error("[unhandled]", err);
  res.status(500).json({ error: { code: "internal", message: "Internal server error" } });
};
app.use(errorHandler);

const HOST = process.env.HOST ?? "0.0.0.0";
app.listen(config.port, HOST, () => {
  console.log(`[elama-backend] listening on http://${HOST}:${config.port}`);
  console.log(`[elama-backend] env=${config.nodeEnv}, db=${config.databasePath}`);
  console.log(`[elama-backend] cors=${config.corsOrigins.join(", ")}`);
});
