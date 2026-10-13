# Progress and Handoff

Read this at the start of each session instead of asking for earlier chat history. Keep it short and update it at the end of each session.

Last updated: 14 Oct 2026

## Project in one line

A webhook delivery platform (Node, Express, MongoDB with Mongoose, Redis with BullMQ). Developers register endpoints, send events to the API, and the platform delivers them signed, retries failures, logs every attempt, and supports replay. Full plan: `docs/DESIGN.md`. Rules: `RULES.md`.

## Done so far

- GitHub repo created and cloned. Project folder: `C:\Pratiksha-Personal\webhook-platform\webhook-platform` (the inner folder is the real repo).
- Documents written: `docs/DESIGN.md`, `RULES.md`, `CLAUDE.md`.
- **Milestone 1 complete** (backend skeleton): Express app in `backend/`, environment config validation, a standard JSON error format for 404, 400 (broken JSON) and 500 (no details leaked), request logging, and a `GET /health` route.
- 7 automated tests pass with Vitest (health route, error handling, environment parsing).
- Committed locally as `f4bb101` ("Add backend skeleton with health route and tests").

## How to run

From the `backend` folder, in a normal terminal (not the Claude Code prompt):

- `npm install` installs packages
- `npm test` runs tests (expect 7 passed)
- `npm run dev` starts the API on port 3000 (auto-restarts on save)
- Check: `http://localhost:3000/health` returns `{"status":"ok"}`

## Decisions made

- Version 1 includes accounts and API keys from day one (not single-user).
- Modern JavaScript (ES modules), Vitest for tests.
- Using Mongoose for MongoDB.
- Claude Code: use Sonnet for routine work, plan mode first for each feature, approve each action.

## Still to confirm or do

- [ ] Run `git push` yourself and check `backend` and the commits appear on GitHub (local `main` was 2 commits ahead of `origin/main`).
- [ ] Do the manual test: `/health`, an unknown URL for the 404, and the bad `PORT` check.
- [ ] Confirm `.env` is not tracked (`git ls-files` should show `.env.example` only).
- [ ] Update the Commands and Current status sections of `CLAUDE.md` (they still say "not set up yet").
- [ ] Decide where MongoDB runs: MongoDB Atlas (free, cloud, quickest) or Docker (local, needs Docker Desktop). Leaning towards Atlas for now, with Docker Compose added later.

## Next: milestone 2 (accounts and API keys)

Per `docs/DESIGN.md`:

1. Connect to MongoDB with Mongoose (connection string only in `.env`, never committed; add a fake value to `.env.example`).
2. `User` and `ApiKey` models (store password hash and API key hash only).
3. `POST /api/auth/register` and `POST /api/auth/login` (bcrypt, JWT, Zod validation).
4. `POST /api/keys`, `GET /api/keys`, `DELETE /api/keys/:id` (JWT required; full key shown once).
5. Middleware that authenticates API requests by API key.
6. Tests for every route, including failure cases.

Start in plan mode and review dependencies and the model design before approving anything.

## How to resume next session

1. Open the project folder in VS Code (inner `webhook-platform` folder).
2. Open a terminal and run `claude`. It reads `CLAUDE.md`, `RULES.md` and `docs/DESIGN.md` automatically.
3. Type `/model` and pick Sonnet, then press Shift + Tab until plan mode shows.
4. Say: "Read docs/PROGRESS.md and continue from the next step. Propose a plan before changing anything."
5. Use a second terminal for your own commands (npm, git).

## Saving tokens

- Use a fresh Claude Code session per milestone (`/clear` between tasks).
- Ask Claude Code to update this file at the end of each session.
- Keep prompts specific: one feature, one step.