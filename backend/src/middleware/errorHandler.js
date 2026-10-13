import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

// The last stop for every error. Always replies in the same shape:
// { "error": { "code": "...", "message": "..." } }
// Express needs all 4 arguments here to treat this as an error handler.
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }

  // Express itself raises 4xx errors, for example when the JSON body is broken.
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: { code: 'BAD_REQUEST', message: 'Bad request' } });
  }

  // Anything else is a bug. Log the details, but tell the client nothing internal.
  logger.error({ err }, 'Unexpected error');
  return res
    .status(500)
    .json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
}
