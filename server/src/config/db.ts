import mongoose from 'mongoose';
import { env } from './env';

function maskUri(uri: string): string {
  // Hide credentials (user:password@) so connection strings never get logged in full.
  return uri.replace(/\/\/([^@/]+)@/, '//***:***@');
}

export async function connectDB(): Promise<void> {
  // On warm serverless invocations mongoose's default connection is still open from the
  // previous call, so skip re-connecting (avoids redundant work/logging per request).
  if (mongoose.connection.readyState === 1) {
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log(`[db] connected to MongoDB at ${maskUri(env.mongoUri)}`);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
