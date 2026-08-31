import { Router } from 'express';
import { body } from 'express-validator';
import { createComment, listComments, updateComment, deleteComment } from '../controllers/comments.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const contentValidation = body('content').isString().trim().isLength({ min: 1, max: 280 });

// Mounted at /api/posts/:postId/comments
export const nestedCommentsRouter = Router({ mergeParams: true });
nestedCommentsRouter.get('/', requireAuth, listComments);
nestedCommentsRouter.post('/', requireAuth, [contentValidation], validate, createComment);

// Mounted at /api/comments/:id
export const commentItemRouter = Router();
commentItemRouter.put('/:id', requireAuth, [contentValidation], validate, updateComment);
commentItemRouter.delete('/:id', requireAuth, deleteComment);
