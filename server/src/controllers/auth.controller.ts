import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ApiError } from '../middleware/errorHandler';
import { isProduction } from '../config/env';

const REFRESH_COOKIE_NAME = 'refreshToken';
// In production the client and server live on different domains (e.g. Vercel + Render),
// so the cookie must be sent cross-site. That requires SameSite=None, which browsers
// only allow when Secure is also set. In local dev (same-site, http) Lax/non-secure works.
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, email, password } = req.body as { username: string; email: string; password: string };

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new ApiError(409, 'Username or email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body as { username: string; password: string };

    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(401, 'Invalid username or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, 'Invalid username or password');
    }

    const accessToken = signAccessToken({ userId: user._id.toString(), username: user.username });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({
      accessToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      throw new ApiError(401, 'Missing refresh token');
    }

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    const accessToken = signAccessToken({ userId: user._id.toString(), username: user.username });
    res.json({ accessToken });
  } catch {
    next(new ApiError(401, 'Invalid or expired refresh token'));
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth', sameSite: REFRESH_COOKIE_OPTIONS.sameSite, secure: REFRESH_COOKIE_OPTIONS.secure });
  res.status(204).send();
}
