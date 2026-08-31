import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';

/**
 * Clears all application collections. Used by the seed/reset scripts and the
 * non-production /api/test/reset endpoint to give test automation a known,
 * clean starting state.
 */
export async function resetDatabase(): Promise<void> {
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({}),
  ]);
}
