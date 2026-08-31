import { connectDB, disconnectDB } from '../src/config/db';
import { resetDatabase } from '../src/utils/resetDatabase';

async function main(): Promise<void> {
  await connectDB();
  await resetDatabase();
  console.log('[reset] all collections cleared');
  await disconnectDB();
}

main().catch((err) => {
  console.error('[reset] failed', err);
  process.exit(1);
});
