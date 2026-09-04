import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import { commentItemRouter } from './routes/comments.routes';
import { registerTestRoutes } from './routes/test.routes';

// Express app setup only (no listen/DB connect here) so it can be reused both by the
// traditional long-running server entrypoint (index.ts) and by serverless deployments
// (api/index.ts), which invoke this same app per-request instead of via app.listen().
const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header, e.g. health checks/curl).
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);
// PaaS/serverless platforms (Render, Vercel, etc.) terminate TLS in front of the app;
// trust the proxy so secure cookies and req.protocol behave correctly in production.
if (env.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}
app.use(cookieParser());
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentItemRouter);

registerTestRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
