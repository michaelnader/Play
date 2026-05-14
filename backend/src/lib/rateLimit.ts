import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./httpError.js";

type Bucket = { count: number; resetAt: number };

export function rateLimit({
  windowMs,
  max,
  keyFn,
}: {
  windowMs: number;
  max: number;
  keyFn?: (req: Request) => string;
}) {
  const store = new Map<string, Bucket>();
  const getKey = keyFn ?? ((req: Request) => req.ip ?? "unknown");

  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
  }, windowMs).unref?.();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = getKey(req);
    const now = Date.now();
    const bucket = store.get(key);
    if (!bucket || bucket.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    bucket.count++;
    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return next(new HttpError(429, "rate_limited", "Too many requests"));
    }
    next();
  };
}
