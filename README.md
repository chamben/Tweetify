# Tweetify

A simplified Twitter-like web app — register, log in, post, comment, and like — built as a
practice project for applying **test automation on a real database** (MongoDB). It's a full
TypeScript stack (React + Express + MongoDB) with clean CRUD flows, JWT auth, and a
production-style codebase that's easy to write UI (Selenium/Cucumber) and API/DB-level
automated tests against.

## Features

- User registration & JWT-based authentication (access token + httpOnly refresh cookie)
- Create, edit, and delete posts (280 char limit)
- Create, edit, and delete comments on posts
- Like / unlike posts
- Real-time-feeling UI (no page reloads needed after posting/commenting)
- Seed & reset scripts for repeatable test data
- A dedicated `/api/test/reset` endpoint (non-production only) for wiping the DB between
  automated test runs

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, Axios |
| Backend | Node.js, Express, TypeScript, Mongoose (MongoDB ODM) |
| Database | MongoDB (Atlas free tier or local) |
| Auth | JWT access token (in-memory) + httpOnly refresh cookie |

## Project Structure

```
database-automation/
├── client/                # React + Vite frontend
│   ├── src/
│   │   ├── api/           # Axios client with auto token-refresh interceptor
│   │   ├── components/    # PostCard, CommentList, LikeButton, Avatar, icons, ErrorBoundary...
│   │   ├── context/       # AuthContext (login/register/logout, session restore)
│   │   ├── pages/         # Login, Register, Feed, PostDetail
│   │   └── utils/         # formatRelativeTime, etc.
│   └── vercel.json        # Vercel deployment config (SPA rewrites, build command)
├── server/                # Express + TypeScript backend
│   ├── src/
│   │   ├── config/        # env.ts, db.ts
│   │   ├── controllers/   # auth, posts, comments, likes
│   │   ├── middleware/     # auth (requireAuth), validate, errorHandler
│   │   ├── models/        # User, Post, Comment, Like (Mongoose schemas)
│   │   ├── routes/        # auth, posts, comments, likes, test
│   │   └── utils/         # jwt helpers, resetDatabase
│   └── scripts/           # seed.ts, reset.ts
├── render.yaml             # Render deployment blueprint (backend)
└── package.json            # npm workspaces root (client + server)
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string (local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

## Getting Started

1. **Clone and install** (installs both workspaces from the root):

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example files and fill in your own values (never commit real `.env` files —
   they're already gitignored):

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   `server/.env`:

   | Variable | Description |
   |---|---|
   | `PORT` | Backend port (default `4000`) |
   | `NODE_ENV` | `development` / `production` |
   | `MONGO_URI` | MongoDB connection string |
   | `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing JWTs |
   | `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (e.g. `15m`, `7d`) |
   | `CLIENT_ORIGIN` | Comma-separated list of allowed frontend origins for CORS |
   | `TEST_RESET_SECRET` | Header secret required to call `/api/test/reset` (dev/test only) |

   `client/.env`:

   | Variable | Description |
   |---|---|
   | `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:4000`) |

3. **Seed the database** (optional, creates sample users/post/comment/like):

   ```bash
   npm run seed
   ```

4. **Run the app** (in two terminals, from the repo root):

   ```bash
   npm run dev:server   # http://localhost:4000
   npm run dev:client   # http://localhost:5173
   ```

5. Open `http://localhost:5173` in your browser.

## Available Scripts (root)

| Script | Description |
|---|---|
| `npm run dev:server` | Start backend in watch mode (ts-node-dev) |
| `npm run dev:client` | Start frontend Vite dev server |
| `npm run build:server` | Compile backend TypeScript to `server/dist` |
| `npm run build:client` | Type-check and build frontend to `client/dist` |
| `npm run seed` | Reset the DB and insert sample data |
| `npm run reset` | Wipe all collections |

## API Overview

All routes are prefixed with `/api`. Except for auth and the health check, routes require a
`Authorization: Bearer <accessToken>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create a new user |
| POST | `/auth/login` | Log in, returns access token + sets refresh cookie |
| POST | `/auth/refresh` | Exchange refresh cookie for a new access token |
| POST | `/auth/logout` | Clear the refresh cookie |
| GET | `/posts` | List posts (paginated) |
| POST | `/posts` | Create a post |
| GET | `/posts/:id` | Get a single post |
| PUT | `/posts/:id` | Update a post (owner only) |
| DELETE | `/posts/:id` | Delete a post (owner only) |
| GET | `/posts/:postId/comments` | List comments on a post |
| POST | `/posts/:postId/comments` | Add a comment |
| PUT | `/comments/:id` | Update a comment (owner only) |
| DELETE | `/comments/:id` | Delete a comment (owner only) |
| GET | `/posts/:postId/likes` | Get like count + likers |
| POST | `/posts/:postId/likes` | Like a post |
| DELETE | `/posts/:postId/likes` | Unlike a post |
| GET | `/health` | Health check |
| POST | `/test/reset` | Wipe all collections (non-production, requires `x-test-reset-secret` header) |

## Testing / Automation Notes

This project was purpose-built to practice test automation against a real database:

- `POST /api/test/reset` gives automated test suites a clean-slate database between runs
  without needing direct DB access — it's disabled whenever `NODE_ENV=production`.
- `npm run seed` / `npm run reset` provide deterministic data for local test development.
- Every list endpoint returns populated author/user references, so API assertions don't need
  extra lookups.
- All interactive elements in the UI carry stable `data-testid` attributes (e.g.
  `login-username-input`, `post-card-{id}`, `like-button-{postId}`) for reliable Selenium/UI
  automation selectors.

## Deployment

- **Backend**: deploy to [Render](https://render.com) using the included `render.yaml`
  blueprint (free tier). Set `MONGO_URI`, `CLIENT_ORIGIN`, and `TEST_RESET_SECRET` in the
  Render dashboard.
- **Frontend**: deploy to [Vercel](https://vercel.com) with the root directory set to
  `client` (uses the included `client/vercel.json`). Set `VITE_API_URL` to your Render
  backend URL.
- Because the frontend and backend live on different domains in production, the refresh
  cookie is issued with `SameSite=None; Secure`, and CORS validates against the
  `CLIENT_ORIGIN` allow-list.

## Security Notes

- Passwords are hashed with bcrypt before being stored.
- Refresh tokens are stored in httpOnly cookies (never accessible to client-side JS).
- Access tokens are kept in memory only (not localStorage) to reduce XSS token-theft risk.
- MongoDB connection strings are never logged in full (credentials are masked in console output).
