import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { Request, Response, NextFunction, CookieOptions } from "express";
import { config } from "./config.js";
import { db, type UserRow } from "./db.js";
import { newId } from "./lib/id.js";
import { HttpError } from "./lib/httpError.js";

const ACCESS_COOKIE = "elama_at";
const REFRESH_COOKIE = "elama_rt";

export type AuthUser = Pick<UserRow, "id" | "email" | "name" | "plan">;

export type AccessClaims = { sub: string; email: string };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(user: AuthUser): string {
  const opts: SignOptions = { expiresIn: config.accessTokenTtl as SignOptions["expiresIn"] };
  return jwt.sign({ sub: user.id, email: user.email }, config.accessTokenSecret, opts);
}

function hashRefresh(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function issueRefreshToken(userId: string): string {
  const raw = crypto.randomBytes(48).toString("base64url");
  const tokenHash = hashRefresh(raw);
  const expiresAt = new Date(
    Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000
  ).toISOString();
  db.prepare(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`
  ).run(newId("rt"), userId, tokenHash, expiresAt);
  return raw;
}

export function rotateRefreshToken(rawOld: string): { user: AuthUser; raw: string } {
  const oldHash = hashRefresh(rawOld);
  const row = db
    .prepare(
      `SELECT rt.id as id, rt.user_id as user_id, rt.expires_at as expires_at, rt.revoked_at as revoked_at
       FROM refresh_tokens rt WHERE token_hash = ?`
    )
    .get(oldHash) as
    | { id: string; user_id: string; expires_at: string; revoked_at: string | null }
    | undefined;

  if (!row) throw new HttpError(401, "invalid_refresh", "Invalid refresh token");
  if (row.revoked_at) throw new HttpError(401, "revoked_refresh", "Refresh token revoked");
  if (new Date(row.expires_at).getTime() < Date.now()) {
    throw new HttpError(401, "expired_refresh", "Refresh token expired");
  }

  db.prepare(`UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE id = ?`).run(row.id);

  const user = db
    .prepare(`SELECT id, email, name, plan FROM users WHERE id = ?`)
    .get(row.user_id) as AuthUser | undefined;
  if (!user) throw new HttpError(401, "user_missing", "User not found");

  const raw = issueRefreshToken(user.id);
  return { user, raw };
}

export function revokeRefreshToken(rawToken: string): void {
  const tokenHash = hashRefresh(rawToken);
  db.prepare(
    `UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE token_hash = ? AND revoked_at IS NULL`
  ).run(tokenHash);
}

export function revokeAllUserSessions(userId: string): void {
  db.prepare(
    `UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE user_id = ? AND revoked_at IS NULL`
  ).run(userId);
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const baseOpts: CookieOptions = {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
    domain: config.cookieDomain,
    path: "/",
  };
  res.cookie(ACCESS_COOKIE, accessToken, { ...baseOpts, maxAge: 15 * 60 * 1000 });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOpts,
    maxAge: config.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

export function clearAuthCookies(res: Response) {
  const baseOpts: CookieOptions = {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
    domain: config.cookieDomain,
  };
  res.clearCookie(ACCESS_COOKIE, { ...baseOpts, path: "/" });
  res.clearCookie(REFRESH_COOKIE, { ...baseOpts, path: "/api/auth" });
}

export function getRefreshFromReq(req: Request): string | undefined {
  return req.cookies?.[REFRESH_COOKIE];
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const token = bearer ?? req.cookies?.[ACCESS_COOKIE];

  if (!token) return next(new HttpError(401, "no_token", "Authentication required"));

  try {
    const claims = jwt.verify(token, config.accessTokenSecret) as AccessClaims;
    const user = db
      .prepare(`SELECT id, email, name, plan FROM users WHERE id = ?`)
      .get(claims.sub) as AuthUser | undefined;
    if (!user) return next(new HttpError(401, "user_missing", "User not found"));
    req.user = user;
    next();
  } catch {
    next(new HttpError(401, "invalid_token", "Invalid or expired token"));
  }
}
