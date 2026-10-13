# Webhook Delivery Platform

A backend service that delivers webhooks reliably: signed payloads, automatic retries with backoff, delivery logs, and replay. This is a portfolio project, built backend-first.

@RULES.md
@docs/DESIGN.md

## Stack

- Node.js with Express, using modern JavaScript (ES modules)
- MongoDB with Mongoose
- Redis with BullMQ for the delivery queue
- Zod for validation, bcrypt and JWT for accounts
- Vitest or Jest with Supertest for tests
- Docker Compose for local services, GitHub Actions for CI

## Folder structure

```
webhook-platform/
├── backend/      all server code (API and worker)
├── docs/         design documents
├── CLAUDE.md     this file
├── RULES.md      rules to always follow
└── README.md     public project page
```

Inside `backend/`, keep a simple layered structure: routes, controllers, services, models, and a separate worker. Ask before creating it.

## Commands

These do not exist yet. Add each command here as soon as it is set up:

- Install: not set up yet
- Run API: not set up yet
- Run worker: not set up yet
- Run tests: not set up yet
- Lint: not set up yet

## Current status

Design is finished. Next up is milestone 1 in `docs/DESIGN.md` (project skeleton). Update this section after each milestone.

## Reminders

- `RULES.md` always applies. Ask before big changes, and never commit secrets.
- The design in `docs/DESIGN.md` is the source of truth. Do not change it without asking.
- The owner is a beginner with Git and backend concepts, so explain steps simply.