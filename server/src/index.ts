import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import { commentItemRouter } from './routes/comments.routes';
import { registerTestRoutes } from './routes/test.routes';

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
// Render/other PaaS proxies terminate TLS in front of the app; trust the proxy so
// secure cookies and req.protocol behave correctly in production.
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

async function start(): Promise<void> {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start().catch((err) => {
  console.error('[server] failed to start', err);
  process.exit(1);
});
