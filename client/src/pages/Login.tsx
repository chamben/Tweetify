import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/icons';

export default function Login(): JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!username.trim() && !password.trim()) {
      setError('Username and password are required');
      return;
    }
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <LogoIcon size={36} />
          <h1>Log in to Tweetify</h1>
        </div>
        <form onSubmit={handleSubmit} data-testid="login-form">
          {error && (
            <p className="error-message" data-testid="login-error">
              {error}
            </p>
          )}
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              data-testid="login-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              data-testid="login-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="full-width" data-testid="login-submit-button" disabled={isSubmitting}>
            Log in
          </button>
        </form>
        <p className="auth-footer">
          No account? <Link to="/register" data-testid="go-to-register-link">Register</Link>
        </p>
      </div>
    </div>
  );
}
