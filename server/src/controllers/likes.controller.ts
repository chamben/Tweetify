import { Response, NextFunction } from 'express';
import { Like } from '../models/Like';
import { Post } from '../models/Post';
import { ApiError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export async function likePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    try {
      const like = await Like.create({ post: postId, user: req.user!.userId });
      res.status(201).json(like);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
        throw new ApiError(409, 'Post already liked by this user');
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

export async function unlikePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { postId } = req.params;
    const result = await Like.findOneAndDelete({ post: postId, user: req.user!.userId });
    if (!result) {
      throw new ApiError(404, 'Like not found for this user/post');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listLikes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post: postId }).populate('user', 'username').lean();
    res.json({ count: likes.length, likes });
  } catch (err) {
    next(err);
  }
}
