import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { ApiError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export async function createPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content } = req.body as { content: string };
    const post = await Post.create({ author: req.user!.userId, content });
    await post.populate('author', 'username');
    res.status(201).json({ ...post.toObject(), commentsCount: 0 });
  } catch (err) {
    next(err);
  }
}

export async function listPosts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) ?? '20', 10);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username')
      .lean();

    const commentCounts = await Comment.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { post: { $in: posts.map((post) => post._id) } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const countByPostId = new Map(commentCounts.map((entry) => [entry._id.toString(), entry.count]));

    res.json(posts.map((post) => ({ ...post, commentsCount: countByPostId.get(post._id.toString()) ?? 0 })));
  } catch (err) {
    next(err);
  }
}

export async function getPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username').lean();
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    const commentsCount = await Comment.countDocuments({ post: post._id });
    res.json({ ...post, commentsCount });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    if (post.author.toString() !== req.user!.userId) {
      throw new ApiError(403, 'You can only update your own posts');
    }

    const { content } = req.body as { content: string };
    post.content = content;
    post.updatedAt = new Date();
    await post.save();
    await post.populate('author', 'username');

    const commentsCount = await Comment.countDocuments({ post: post._id });
    res.json({ ...post.toObject(), commentsCount });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    if (post.author.toString() !== req.user!.userId) {
      throw new ApiError(403, 'You can only delete your own posts');
    }

    await post.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
