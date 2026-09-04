import type { IncomingMessage, ServerResponse } from 'http';
import app from '../src/app';
import { connectDB } from '../src/config/db';

// Vercel Node.js serverless entrypoint. An Express app instance is itself a valid
// (req, res) request handler, so it can be exported directly and invoked per-request
// instead of via app.listen(). The DB connection is cached across warm invocations
// (see connectDB in src/config/db.ts), so this stays cheap on repeated calls.
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await connectDB();
  app(req, res);
}
