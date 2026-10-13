import pino from 'pino';
import { env } from '../config/env.js';

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : env.LOG_LEVEL,
  // Never write API keys or tokens to the logs.
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  // Readable logs on your screen while developing, plain JSON in production.
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});
