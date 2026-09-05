import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { LikeButton } from './LikeButton';
import { Avatar } from './Avatar';
import { ConfirmDialog } from './ConfirmDialog';
import { CommentIcon, EditIcon, DeleteIcon } from './icons';
import { formatRelativeTime } from '../utils/formatRelativeTime';

interface PostCardProps {
  post: Post;
  onDeleted: (postId: string) => void;
  onUpdated: (post: Post) => void;
}

export function PostCard({ post, onDeleted, onUpdated }: PostCardProps): JSX.Element {
  const { user } = useAuth();
  const isOwner = user?.id === post.author._id;
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleSave(): Promise<void> {
    const { data } = await apiClient.put<Post>(`/api/posts/${post._id}`, { content });
    onUpdated(data);
    setIsEditing(false);
  }

  async function handleDelete(): Promise<void> {
    setConfirmingDelete(false);
    await apiClient.delete(`/api/posts/${post._id}`);
    onDeleted(post._id);
  }

  return (
    <div className="card" data-testid={`post-card-${post._id}`}>
      <div className="post-header">
        <Avatar username={post.author.username} />
        <div className="post-body">
          <div className="post-meta">
            <span className="username">@{post.author.username}</span>
            <span className="timestamp">{formatRelativeTime(post.createdAt)}</span>
          </div>

          {isEditing ? (
            <div className="form-field">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                data-testid={`post-edit-input-${post._id}`}
                maxLength={280}
              />
              <div className="composer-actions" style={{ gap: 8 }}>
                <button className="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button onClick={handleSave} data-testid={`post-save-button-${post._id}`}>
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="post-content" data-testid={`post-content-${post._id}`}>
              {post.content}
            </p>
          )}

          <div className="post-actions">
            <LikeButton postId={post._id} />
            <Link to={`/posts/${post._id}`} className="icon-button" data-testid={`post-detail-link-${post._id}`}>
              <CommentIcon /> Comments <span data-testid={`comment-count-${post._id}`}>{post.commentsCount}</span>
            </Link>
            {isOwner && !isEditing && (
              <>
                <button
                  className="icon-button"
                  onClick={() => setIsEditing(true)}
                  data-testid={`post-edit-button-${post._id}`}
                >
                  <EditIcon />
                </button>
                <button
                  className="icon-button"
                  onClick={() => setConfirmingDelete(true)}
                  data-testid={`post-delete-button-${post._id}`}
                >
                  <DeleteIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete post?"
        message="Are you sure you want to delete this post?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
