import { Router } from "express";
import { z } from "zod";
import { db, type UserRow } from "../db.js";
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  revokeRefreshToken,
  getRefreshFromReq,
  requireAuth,
  type AuthUser,
} from "../auth.js";
import { newId } from "../lib/id.js";
import { HttpError } from "../lib/httpError.js";
import { validateBody } from "../lib/validate.js";
import { rateLimit } from "../lib/rateLimit.js";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

const signupSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(80).trim(),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1).max(128),
});

const userPublic = (u: AuthUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  plan: u.plan,
});

router.post(
  "/signup",
  authLimiter,
  validateBody(signupSchema),
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body as z.infer<typeof signupSchema>;

      const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email) as
        | { id: string }
        | undefined;
      if (existing) throw new HttpError(409, "email_taken", "Email already registered");

      const id = newId("usr");
      const hash = await hashPassword(password);
      db.prepare(
        `INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)`
      ).run(id, email, hash, name);

      const user: AuthUser = { id, email, name, plan: "free" };
      const access = signAccessToken(user);
      const refresh = issueRefreshToken(user.id);
      setAuthCookies(res, access, refresh);

      res.status(201).json({ user: userPublic(user), accessToken: access });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as z.infer<typeof loginSchema>;
      const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as
        | UserRow
        | undefined;
      if (!row) throw new HttpError(401, "invalid_credentials", "Invalid email or password");

      const ok = await verifyPassword(password, row.password_hash);
      if (!ok) throw new HttpError(401, "invalid_credentials", "Invalid email or password");

      const user: AuthUser = { id: row.id, email: row.email, name: row.name, plan: row.plan };
      const access = signAccessToken(user);
      const refresh = issueRefreshToken(user.id);
      setAuthCookies(res, access, refresh);

      res.json({ user: userPublic(user), accessToken: access });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/refresh", (req, res, next) => {
  try {
    const raw = getRefreshFromReq(req);
    if (!raw) throw new HttpError(401, "no_refresh", "No refresh token");
    const { user, raw: newRefresh } = rotateRefreshToken(raw);
    const access = signAccessToken(user);
    setAuthCookies(res, access, newRefresh);
    res.json({ user: userPublic(user), accessToken: access });
  } catch (err) {
    clearAuthCookies(res);
    next(err);
  }
});

router.post("/logout", (req, res) => {
  const raw = getRefreshFromReq(req);
  if (raw) revokeRefreshToken(raw);
  clearAuthCookies(res);
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: userPublic(req.user!) });
});

export default router;
