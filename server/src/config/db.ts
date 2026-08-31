import mongoose from 'mongoose';
import { env } from './env';

function maskUri(uri: string): string {
  // Hide credentials (user:password@) so connection strings never get logged in full.
  return uri.replace(/\/\/([^@/]+)@/, '//***:***@');
}

export async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log(`[db] connected to MongoDB at ${maskUri(env.mongoUri)}`);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
