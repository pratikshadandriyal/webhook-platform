import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger.js';
import healthRoutes from './routes/health.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// Builds the Express app without starting it, so tests can use it directly.
const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use(healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
