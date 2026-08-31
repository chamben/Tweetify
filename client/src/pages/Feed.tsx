import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { PostCard } from '../components/PostCard';
import { Avatar } from '../components/Avatar';
import { LogoIcon } from '../components/icons';

export default function Feed(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Post[]>('/api/posts').then(({ data }) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, []);

  async function handleCreate(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const { data } = await apiClient.post<Post>('/api/posts', { content: newPostContent });
    setPosts((prev) => [data, ...prev]);
    setNewPostContent('');
  }

  async function handleLogout(): Promise<void> {
    await logout();
    navigate('/login');
  }

  return (
    <div className="page">
      <div className="top-nav">
        <div className="top-nav-brand">
          <LogoIcon />
          <h1>Tweetify</h1>
        </div>
        <div className="top-nav-user">
          <Avatar username={user?.username ?? '?'} size={32} />
          <span data-testid="current-username">@{user?.username}</span>
          <button className="secondary" onClick={handleLogout} data-testid="logout-button">
            Log out
          </button>
        </div>
      </div>

      <div className="app-container">
        <form onSubmit={handleCreate} className="card composer">
          <Avatar username={user?.username ?? '?'} />
          <div className="composer-body form-field" style={{ marginBottom: 0 }}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening?"
              data-testid="new-post-input"
              maxLength={280}
            />
            <div className="composer-actions">
              <button type="submit" data-testid="new-post-submit-button">
                Post
              </button>
            </div>
          </div>
        </form>

        {isLoading && <p className="loading-state">Loading posts...</p>}

        {!isLoading && posts.length === 0 && (
          <p className="empty-state" data-testid="empty-feed">
            No posts yet. Be the first to post!
          </p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
            onUpdated={(updated) => setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))}
          />
        ))}
      </div>
    </div>
  );
}
