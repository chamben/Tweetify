import { Schema, model, Types } from 'mongoose';

export interface IPost {
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 280 },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

postSchema.index({ createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);
