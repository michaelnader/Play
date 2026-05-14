# Elama Backend

Express + TypeScript + SQLite backend for the Elama AI content creator.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server starts on http://localhost:4000. SQLite database auto-creates at `./data/elama.db`.

## Endpoints

### Auth (`/api/auth`)

| Method | Path        | Body                          | Description                   |
| ------ | ----------- | ----------------------------- | ----------------------------- |
| POST   | `/signup`   | `{ email, password, name }`   | Create account, returns user + sets cookies |
| POST   | `/login`    | `{ email, password }`         | Login, returns user + sets cookies          |
| POST   | `/refresh`  | (cookie)                      | Rotate refresh token, return new access     |
| POST   | `/logout`   | (cookie)                      | Revoke refresh, clear cookies               |
| GET    | `/me`       | (auth)                        | Get current user                            |

### Chats (`/api/chats`) — auth required

| Method | Path                  | Body                  | Description                          |
| ------ | --------------------- | --------------------- | ------------------------------------ |
| GET    | `/`                   |                       | List user's chats                    |
| POST   | `/`                   | `{ title?, mode? }`   | Create chat                          |
| GET    | `/:id`                |                       | Get chat + messages                  |
| PATCH  | `/:id`                | `{ title?, mode? }`   | Update chat                          |
| DELETE | `/:id`                |                       | Delete chat (cascades messages)      |
| POST   | `/:id/messages`       | `{ content }`         | Send user message, get mock reply    |

### Health

`GET /api/health` → `{ status, env, time }`

## Auth model

- Access token: JWT, 15 min, in httpOnly cookie `elama_at` (also returned in JSON for `Authorization: Bearer ...`).
- Refresh token: opaque random, 30 days, in httpOnly cookie `elama_rt` scoped to `/api/auth`.
- Refresh tokens are SHA-256 hashed in the DB and rotated on every `/refresh` call (single-use).
- Passwords hashed with bcryptjs (cost 12).
- Auth routes rate-limited to 30 req / 15 min per IP.

## Notes

- Replace `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` with strong values in production.
- For production, set `NODE_ENV=production` and use HTTPS so cookies get `Secure` + `SameSite=None`.
