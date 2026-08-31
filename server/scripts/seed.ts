import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from '../src/config/db';
import { resetDatabase } from '../src/utils/resetDatabase';
import { User } from '../src/models/User';
import { Post } from '../src/models/Post';
import { Comment } from '../src/models/Comment';
import { Like } from '../src/models/Like';

// Known, fixed test data for repeatable DB/UI test automation.
const SEED_PASSWORD = 'Password123!';

async function main(): Promise<void> {
  await connectDB();
  await resetDatabase();

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const [alice, bob] = await User.create([
    { username: 'alice', email: 'alice@example.com', passwordHash },
    { username: 'bob', email: 'bob@example.com', passwordHash },
  ]);

  const post = await Post.create({ author: alice._id, content: 'Hello world, this is my first post!' });

  await Comment.create({ post: post._id, author: bob._id, content: 'Nice first post!' });

  await Like.create({ post: post._id, user: bob._id });

  console.log('[seed] created users: alice, bob (password: %s)', SEED_PASSWORD);
  console.log('[seed] created 1 post, 1 comment, 1 like');

  await disconnectDB();
}

main().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
