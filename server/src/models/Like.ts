import { Schema, model, Types } from 'mongoose';

export interface ILike {
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: () => new Date() },
});

// Prevent the same user from liking the same post more than once.
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = model<ILike>('Like', likeSchema);
