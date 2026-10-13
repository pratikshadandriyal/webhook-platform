import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import app from '../src/app.js';
import { parseEnv } from '../src/config/env.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('error handling', () => {
  it('returns a standard 404 for an unknown route', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 400 for a broken JSON body', async () => {
    const res = await request(app)
      .post('/health')
      .set('Content-Type', 'application/json')
      .send('{ not json');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('returns 500 without leaking details when something unexpected breaks', async () => {
    const brokenApp = express();
    brokenApp.get('/boom', () => {
      throw new Error('secret database password is hunter2');
    });
    brokenApp.use(errorHandler);

    const res = await request(brokenApp).get('/boom');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
    });
    expect(JSON.stringify(res.body)).not.toContain('hunter2');
  });
});

describe('parseEnv', () => {
  it('applies defaults when nothing is set', () => {
    expect(parseEnv({})).toEqual({ NODE_ENV: 'development', PORT: 3000, LOG_LEVEL: 'info' });
  });

  it('rejects an invalid PORT and names it in the message', () => {
    expect(() => parseEnv({ PORT: 'abc' })).toThrow(/PORT/);
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(() => parseEnv({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });
});
