import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/icons';

export default function Register(): JSX.Element {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    const missing: string[] = [];
    if (!username.trim()) missing.push('Username');
    if (!email.trim()) missing.push('Email');
    if (!password.trim()) missing.push('Password');

    if (missing.length > 0) {
      setError(`${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required`);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate('/login');
    } catch {
      setError('Registration failed. Username or email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <LogoIcon size={36} />
          <h1>Join Tweetify</h1>
        </div>
        <form onSubmit={handleSubmit} data-testid="register-form">
          {error && (
            <p className="error-message" data-testid="register-error">
              {error}
            </p>
          )}
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              data-testid="register-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              data-testid="register-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              data-testid="register-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="full-width" data-testid="register-submit-button" disabled={isSubmitting}>
            Register
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login" data-testid="go-to-login-link">Log in</Link>
        </p>
      </div>
    </div>
  );
}
