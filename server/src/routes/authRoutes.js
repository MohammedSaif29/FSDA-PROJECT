import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRecaptcha } from '../middlewares/validateRecaptcha.js';
import { authLimiter, forgotPasswordLimiter } from '../middlewares/rateLimiters.js';
import {
  adminOnly,
  completeGoogleAuth,
  forgotPassword,
  googleAuth,
  googleCallback,
  googleStatus,
  login,
  logout,
  me,
  refreshToken,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, validateRecaptcha, asyncHandler(register));
router.post('/login', authLimiter, validateRecaptcha, asyncHandler(login));
router.post('/verify-email', asyncHandler(verifyEmail));
router.post('/forgot-password', forgotPasswordLimiter, validateRecaptcha, asyncHandler(forgotPassword));
router.post('/reset-password', authLimiter, validateRecaptcha, asyncHandler(resetPassword));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));
router.get('/google/status', googleStatus);
router.get('/google', googleAuth());
router.get('/google/callback', googleCallback(), asyncHandler(completeGoogleAuth));
router.get('/me', authenticate, asyncHandler(me));
router.get('/admin', authenticate, authorize('ADMIN'), asyncHandler(adminOnly));

export default router;
