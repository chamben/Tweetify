import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { LikesResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { HeartIcon, HeartFilledIcon } from './icons';

export function LikeButton({ postId }: { postId: string }): JSX.Element {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiClient.get<LikesResponse>(`/api/posts/${postId}/likes`).then(({ data }) => {
      if (cancelled) return;
      setCount(data.count);
      setLikedByMe(data.likes.some((like) => like.user._id === user?.id));
    });
    return () => {
      cancelled = true;
    };
  }, [postId, user?.id]);

  async function toggleLike(): Promise<void> {
    setIsLoading(true);
    try {
      if (likedByMe) {
        await apiClient.delete(`/api/posts/${postId}/likes`);
        setLikedByMe(false);
        setCount((c) => c - 1);
      } else {
        await apiClient.post(`/api/posts/${postId}/likes`);
        setLikedByMe(true);
        setCount((c) => c + 1);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      data-testid={`like-button-${postId}`}
      className={`icon-button${likedByMe ? ' liked' : ''}`}
    >
      {likedByMe ? <HeartFilledIcon /> : <HeartIcon />}
      <span data-testid={`like-count-${postId}`}>{count}</span>
    </button>
  );
}
