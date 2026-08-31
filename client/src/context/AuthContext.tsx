import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, setAccessToken } from '../api/client';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeAccessToken(token: string): { userId: string; username: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return { userId: decoded.userId, username: decoded.username };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore a session using the httpOnly refresh cookie on page load.
    (async () => {
      try {
        const { data } = await apiClient.post<{ accessToken: string }>('/api/auth/refresh');
        setAccessToken(data.accessToken);
        const decoded = decodeAccessToken(data.accessToken);
        if (decoded) {
          setUser({ id: decoded.userId, username: decoded.username });
        }
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(username: string, password: string): Promise<void> {
    const { data } = await apiClient.post<{ accessToken: string; user: AuthUser }>('/api/auth/login', {
      username,
      password,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function register(username: string, email: string, password: string): Promise<void> {
    await apiClient.post('/api/auth/register', { username, email, password });
  }

  async function logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
