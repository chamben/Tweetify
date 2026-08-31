import { Router } from 'express';
import { body } from 'express-validator';
import { createPost, listPosts, getPost, updatePost, deletePost } from '../controllers/posts.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { nestedCommentsRouter } from './comments.routes';
import { nestedLikesRouter } from './likes.routes';

const router = Router();

const contentValidation = body('content').isString().trim().isLength({ min: 1, max: 280 });

router.get('/', requireAuth, listPosts);
router.get('/:id', requireAuth, getPost);
router.post('/', requireAuth, [contentValidation], validate, createPost);
router.put('/:id', requireAuth, [contentValidation], validate, updatePost);
router.delete('/:id', requireAuth, deletePost);

router.use('/:postId/comments', nestedCommentsRouter);
router.use('/:postId/likes', nestedLikesRouter);

export default router;
