import { Response, NextFunction } from 'express';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { ApiError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export async function createComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    const { content } = req.body as { content: string };
    const comment = await Comment.create({ post: postId, author: req.user!.userId, content });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function listComments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate('author', 'username')
      .lean();
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function updateComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }
    if (comment.author.toString() !== req.user!.userId) {
      throw new ApiError(403, 'You can only update your own comments');
    }

    const { content } = req.body as { content: string };
    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();
    await comment.populate('author', 'username');

    res.json(comment);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }
    if (comment.author.toString() !== req.user!.userId) {
      throw new ApiError(403, 'You can only delete your own comments');
    }

    await comment.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
