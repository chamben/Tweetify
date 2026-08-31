import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Post } from '../types';
import { LikeButton } from '../components/LikeButton';
import { CommentList } from '../components/CommentList';
import { Avatar } from '../components/Avatar';
import { BackIcon, LogoIcon } from '../components/icons';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export default function PostDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    apiClient.get<Post>(`/api/posts/${id}`).then(({ data }) => setPost(data));
  }, [id]);

  return (
    <div className="page">
      <div className="top-nav">
        <div className="top-nav-brand">
          <LogoIcon />
          <h1>Tweetify</h1>
        </div>
      </div>

      <div className="app-container">
        <Link to="/" className="icon-button" data-testid="back-to-feed-link" style={{ marginBottom: 12 }}>
          <BackIcon /> Back to feed
        </Link>

        {!post || !id ? (
          <p className="loading-state">Loading...</p>
        ) : (
          <>
            <div className="card" data-testid={`post-card-${post._id}`}>
              <div className="post-header">
                <Avatar username={post.author.username} />
                <div className="post-body">
                  <div className="post-meta">
                    <span className="username">@{post.author.username}</span>
                    <span className="timestamp">{formatRelativeTime(post.createdAt)}</span>
                  </div>
                  <p className="post-content" data-testid={`post-content-${post._id}`}>
                    {post.content}
                  </p>
                  <div className="post-actions">
                    <LikeButton postId={post._id} />
                  </div>
                </div>
              </div>
            </div>

            <CommentList postId={id} />
          </>
        )}
      </div>
    </div>
  );
}
