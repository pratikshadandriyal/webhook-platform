# Webhook Delivery Platform: Design

## 1. Overview

A backend service that delivers webhooks reliably. A developer signs up, registers one or more destination URLs ("endpoints"), and sends events to this platform's API. The platform delivers each event to the registered endpoints with a signed payload, retries failures with increasing delays, records every attempt, and lets the developer replay past events.

## 2. The problem

Sending a single webhook is easy. Doing it reliably is not:

- The receiving server may be down or slow. When do we retry, and when do we give up?
- The receiver needs to know the message is genuine and was not forged.
- The same event may be delivered twice. Senders and receivers need a way to handle that.
- Developers need visibility: what was sent, what failed, and why, plus a way to resend.

This project is a small version of what Stripe or Svix provide.

## 3. Goals (version 1)

1. Accounts and API keys
2. Endpoint management (add, list, update, disable)
3. Event ingestion through an API
4. Signed delivery to every active endpoint
5. Automatic retries with backoff, ending in a "failed" state
6. Delivery logs for every attempt
7. Replay of any past event

## 4. Non-goals (version 1)

Billing, teams and roles, multiple regions, email or Slack alerts, a full frontend (a simple dashboard comes after the backend is solid), and per-endpoint rate limits. These are left out on purpose to keep the project finishable.

## 5. Tech stack

| Part | Choice |
|---|---|
| Runtime and API | Node.js, Express |
| Database | MongoDB with Mongoose |
| Job queue | Redis with BullMQ |
| Passwords and tokens | bcrypt, JWT |
| Validation | Zod |
| Testing | Vitest or Jest, Supertest |
| Packaging | Docker Compose (API, worker, MongoDB, Redis), GitHub Actions for CI |

## 6. How it works

1. A client calls `POST /api/events` with an API key.
2. The API validates the request, saves the event, and creates one delivery record per matching active endpoint.
3. Each delivery is added to a Redis queue and the API responds immediately (`202 Accepted`).
4. A separate worker process takes jobs from the queue and sends an HTTP POST to the endpoint URL, with a timeout.
5. A 2xx response marks the delivery as `succeeded`. Anything else (error status, timeout, network failure) is recorded as a failed attempt and rescheduled.
6. After the final retry fails, the delivery is marked `failed` and stays available for replay.

The API and the worker are separate processes so that slow or failing endpoints never slow down event ingestion.

## 7. Data models

**User**: email, passwordHash, createdAt

**ApiKey**: userId, name, keyPrefix, keyHash, lastUsedAt, revokedAt. Only a hash of the key is stored, and the full key is shown once at creation.

**Endpoint**: userId, url, description, signingSecret, eventTypes (list, empty means all), active, createdAt

**Event**: userId, type, payload (JSON), idempotencyKey (optional, unique per user), createdAt

**Delivery**: eventId, endpointId, status (`pending`, `succeeded`, `failed`), attemptCount, nextAttemptAt, lastAttemptAt

**DeliveryAttempt**: deliveryId, attemptNumber, statusCode, responseSnippet, error, durationMs, createdAt

## 8. API endpoints

Account routes use a JWT. All other routes use an API key in the `Authorization: Bearer <key>` header.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, receive a JWT |
| POST | `/api/keys` | Create an API key (JWT) |
| GET | `/api/keys` | List keys (JWT) |
| DELETE | `/api/keys/:id` | Revoke a key (JWT) |
| POST | `/api/endpoints` | Register a destination URL |
| GET | `/api/endpoints` | List endpoints |
| PATCH | `/api/endpoints/:id` | Update or disable an endpoint |
| DELETE | `/api/endpoints/:id` | Delete an endpoint |
| POST | `/api/events` | Send an event |
| GET | `/api/events` | List events (paginated) |
| GET | `/api/events/:id` | Event details with its deliveries |
| GET | `/api/events/:id/attempts` | Every delivery attempt for an event |
| POST | `/api/events/:id/replay` | Resend an event |
| GET | `/health` | Health check |

## 9. Signing

Every delivery includes a signature so the receiver can verify it came from this platform.

- Header: `X-Webhook-Signature: t=<unix timestamp>,v1=<signature>`
- The signature is HMAC-SHA256 of `<timestamp>.<raw body>`, using the endpoint's signing secret.
- Receivers should reject messages with an old timestamp (for example older than 5 minutes) to prevent replay attacks.
- Each delivery also carries an `X-Webhook-Id` header, so receivers can ignore duplicates.

## 10. Retry policy (proposal)

| Attempt | Delay after the previous failure |
|---|---|
| 1 | immediately |
| 2 | 10 seconds |
| 3 | 1 minute |
| 4 | 10 minutes |
| 5 | 1 hour |
| 6 | 6 hours |

After attempt 6 fails, the delivery is marked `failed`. The request timeout is 10 seconds. Delivery is at-least-once, so receivers must tolerate duplicates.

## 11. Idempotency

Clients may send an `Idempotency-Key` header on `POST /api/events`. If the same key is sent again, the API returns the original event instead of creating a duplicate.

## 12. Security

- Passwords hashed with bcrypt; API keys stored only as hashes.
- Input validation on every route.
- Rate limiting on auth routes and event ingestion.
- Block destination URLs that point to private or internal addresses (localhost, `10.x`, `192.168.x`, and similar), to prevent the platform being used to attack internal networks (SSRF).
- Secrets only in environment variables, never committed.

## 13. Testing

- Unit tests for signing and retry scheduling.
- Integration tests for every API route.
- Delivery tests using a fake receiver that fails, times out, or succeeds on a chosen attempt.

## 14. Build milestones

1. Project skeleton: Express, config, error handling, logging, health check
2. Auth: register, login, API keys
3. Endpoints API
4. Events API and idempotency
5. Worker and signed delivery
6. Retries and failed state
7. Delivery logs and replay
8. Hardening: validation, rate limiting, SSRF protection
9. Tests, Docker Compose, CI
10. README, architecture diagram, deployment
11. Simple React dashboard (after the backend is done)

## 15. Open decisions

- Final retry schedule and number of attempts
- Whether event types must be declared before use
- Payload size limit