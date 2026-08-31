import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3, max: 30 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
  ],
  validate,
  register,
);

router.post(
  '/login',
  [
    body('username').isString().trim().notEmpty(),
    body('password').isString().notEmpty({ ignore_whitespace: true }),
  ],
  validate,
  login,
);

router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
