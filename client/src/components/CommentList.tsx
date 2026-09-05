import { useEffect, useState, FormEvent } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Comment } from '../types';
import { Avatar } from './Avatar';
import { ConfirmDialog } from './ConfirmDialog';
import { EditIcon, DeleteIcon } from './icons';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export function CommentList({ postId }: { postId: string }): JSX.Element {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<Comment[]>(`/api/posts/${postId}/comments`).then(({ data }) => setComments(data));
  }, [postId]);

  async function handleAdd(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data } = await apiClient.post<Comment>(`/api/posts/${postId}/comments`, { content: newComment });
    setComments((prev) => [...prev, data]);
    setNewComment('');
  }

  async function handleUpdate(commentId: string): Promise<void> {
    const { data } = await apiClient.put<Comment>(`/api/comments/${commentId}`, { content: editContent });
    setComments((prev) => prev.map((c) => (c._id === commentId ? data : c)));
    setEditingId(null);
  }

  async function handleDelete(commentId: string): Promise<void> {
    setDeletingId(null);
    await apiClient.delete(`/api/comments/${commentId}`);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  }

  return (
    <div data-testid={`comment-list-${postId}`}>
      <h3 style={{ margin: '20px 0 10px' }}>Comments</h3>
      <form onSubmit={handleAdd} className="card composer">
        <Avatar username={user?.username ?? '?'} size={36} />
        <div className="composer-body form-field" style={{ marginBottom: 0 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            data-testid={`comment-input-${postId}`}
            maxLength={280}
          />
          <div className="composer-actions">
            <button type="submit" data-testid={`comment-submit-button-${postId}`}>
              Comment
            </button>
          </div>
        </div>
      </form>

      {comments.map((comment) => (
        <div className="card" key={comment._id} data-testid={`comment-card-${comment._id}`}>
          <div className="post-header">
            <Avatar username={comment.author.username} size={36} />
            <div className="post-body">
              <div className="post-meta">
                <span className="username">@{comment.author.username}</span>
                <span className="timestamp">{formatRelativeTime(comment.createdAt)}</span>
              </div>

              {editingId === comment._id ? (
                <div className="form-field">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    data-testid={`comment-edit-input-${comment._id}`}
                  />
                  <div className="composer-actions" style={{ gap: 8 }}>
                    <button className="secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                    <button onClick={() => handleUpdate(comment._id)} data-testid={`comment-save-button-${comment._id}`}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="post-content" data-testid={`comment-content-${comment._id}`}>
                  {comment.content}
                </p>
              )}

              {user?.id === comment.author._id && editingId !== comment._id && (
                <div className="post-actions">
                  <button
                    className="icon-button"
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditContent(comment.content);
                    }}
                    data-testid={`comment-edit-button-${comment._id}`}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => setDeletingId(comment._id)}
                    data-testid={`comment-delete-button-${comment._id}`}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <ConfirmDialog
        open={deletingId !== null}
        title="Delete comment?"
        message="Are you sure you want to delete this comment?"
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
