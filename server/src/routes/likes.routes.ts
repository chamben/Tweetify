import { Router } from 'express';
import { likePost, unlikePost, listLikes } from '../controllers/likes.controller';
import { requireAuth } from '../middleware/auth';

// Mounted at /api/posts/:postId/likes
export const nestedLikesRouter = Router({ mergeParams: true });
nestedLikesRouter.get('/', requireAuth, listLikes);
nestedLikesRouter.post('/', requireAuth, likePost);
nestedLikesRouter.delete('/', requireAuth, unlikePost);
