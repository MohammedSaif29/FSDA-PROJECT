import passport from 'passport';
import { config } from '../config.js';
import {
  comparePassword,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  findUserByVerificationToken,
  updateUser,
} from '../models/User.js';
import { generateRandomToken, hashToken } from '../utils/crypto.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshCookieOptions,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/emailService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getRoleForEmail = (email) => (
  config.adminEmails.includes(email.toLowerCase()) ? 'ADMIN' : 'USER'
);

const buildAppUrl = (path) => `${config.clientUrl.replace(/\/$/, '')}${path}`;

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
  avatarUrl: user.avatarUrl,
});

const clearCookieOptions = () => {
  const options = getRefreshCookieOptions();
  return {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
  };
};

const setRefreshSession = async (response, user) => {
  const refreshToken = generateRefreshToken(user);
  await updateUser(user.id, {
    refreshTokenHash: hashToken(refreshToken),
    lastLoginAt: new Date(),
  });

  response.cookie(config.cookieName, refreshToken, getRefreshCookieOptions());
};

const clearRefreshSession = async (response, user = null) => {
  if (user) {
    await updateUser(user.id, { refreshTokenHash: null });
  }

  response.clearCookie(config.cookieName, clearCookieOptions());
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include uppercase, lowercase, and a number.';
  }

  return null;
};

export async function register(request, response) {
  const { username, email, password, confirmPassword } = request.body;

  if (!username?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
    return response.status(400).json({ error: 'Username, email, password, and confirm password are required.' });
  }

  if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ error: 'Password and confirm password must match.' });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return response.status(400).json({ error: passwordError });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return response.status(409).json({ error: 'A user with this email already exists.' });
  }

  const rawVerificationToken = generateRandomToken();
  const user = await createUser({
    username: username.trim(),
    email: normalizedEmail,
    password,
    role: getRoleForEmail(normalizedEmail),
    authProvider: 'LOCAL',
    isEmailVerified: false,
    emailVerificationToken: hashToken(rawVerificationToken),
    emailVerificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const verificationLink = buildAppUrl(`/#/verify-email?token=${rawVerificationToken}&email=${encodeURIComponent(user.email)}`);
  await sendVerificationEmail({
    email: user.email,
    username: user.username,
    verificationLink,
  });

  return response.status(201).json({
    message: 'Registration successful. Please verify your email before logging in.',
    user: sanitizeUser(user),
  });
}

export async function login(request, response) {
  const { identifier, email, password } = request.body;
  const resolvedEmail = (identifier || email || '').trim().toLowerCase();

  if (!resolvedEmail || !password?.trim()) {
    return response.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await findUserByEmail(resolvedEmail, { includePassword: true });

  if (!user) {
    return response.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.authProvider === 'GOOGLE' && !user.password) {
    return response.status(400).json({ error: 'This account uses Google sign-in. Please continue with Google.' });
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    return response.status(401).json({ error: 'Invalid email or password.' });
  }

  if (!user.isEmailVerified) {
    return response.status(403).json({ error: 'Verify your email before signing in.' });
  }

  await setRefreshSession(response, user);
  const accessToken = generateAccessToken(user);

  return response.json({
    message: 'Login successful.',
    accessToken,
    token: accessToken,
    user: sanitizeUser(user),
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
}

export async function verifyEmail(request, response) {
  const { token, email } = request.body;

  if (!token || !email?.trim()) {
    return response.status(400).json({ error: 'Verification token and email are required.' });
  }

  const user = await findUserByVerificationToken(email.trim().toLowerCase(), hashToken(token));

  if (!user) {
    return response.status(400).json({ error: 'Verification link is invalid or has expired.' });
  }

  const updatedUser = await updateUser(user.id, {
    isEmailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpiresAt: null,
  });

  return response.json({
    message: 'Email verified successfully. You can now sign in.',
    user: sanitizeUser(updatedUser),
  });
}

export async function forgotPassword(request, response) {
  const { email } = request.body;

  if (!email?.trim()) {
    return response.status(400).json({ error: 'Email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (user) {
    const rawResetToken = generateRandomToken();
    await updateUser(user.id, {
      passwordResetToken: hashToken(rawResetToken),
      passwordResetExpiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });

    const resetLink = buildAppUrl(`/#/reset-password?token=${rawResetToken}&email=${encodeURIComponent(user.email)}`);
    await sendPasswordResetEmail({
      email: user.email,
      username: user.username,
      resetLink,
    });
  }

  return response.json({
    message: 'If an account with that email exists, a password reset link has been sent.',
  });
}

export async function resetPassword(request, response) {
  const { token, email, password, confirmPassword } = request.body;

  if (!token || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
    return response.status(400).json({ error: 'All reset password fields are required.' });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ error: 'Password and confirm password must match.' });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return response.status(400).json({ error: passwordError });
  }

  const user = await findUserByResetToken(email.trim().toLowerCase(), hashToken(token));

  if (!user) {
    return response.status(400).json({ error: 'Reset link is invalid or has expired.' });
  }

  await updateUser(user.id, {
    password,
    passwordResetToken: null,
    passwordResetExpiresAt: null,
    refreshTokenHash: null,
  });

  response.clearCookie(config.cookieName, clearCookieOptions());

  return response.json({ message: 'Password updated successfully. Please sign in again.' });
}

export async function refreshToken(request, response) {
  const refreshToken = request.cookies[config.cookieName];

  if (!refreshToken) {
    return response.status(401).json({ error: 'Refresh token is missing.' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await findUserById(payload.sub);

    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashToken(refreshToken)) {
      return response.status(401).json({ error: 'Refresh token is invalid.' });
    }

    await setRefreshSession(response, user);
    const accessToken = generateAccessToken(user);

    return response.json({
      accessToken,
      token: accessToken,
      user: sanitizeUser(user),
    });
  } catch {
    return response.status(401).json({ error: 'Refresh token has expired.' });
  }
}

export async function logout(request, response) {
  const refreshToken = request.cookies[config.cookieName];

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await findUserById(payload.sub);
      await clearRefreshSession(response, user);
    } catch {
      response.clearCookie(config.cookieName, clearCookieOptions());
    }
  } else {
    response.clearCookie(config.cookieName, clearCookieOptions());
  }

  if (request.logout) {
    request.logout(() => {});
  }

  return response.json({ message: 'Logged out successfully.' });
}

export function googleStatus(_request, response) {
  response.json({
    configured: Boolean(config.google.clientId && config.google.clientSecret),
    recaptchaEnabled: Boolean(config.recaptcha.siteKey && config.recaptcha.secretKey),
  });
}

export function googleAuth() {
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  });
}

export function googleCallback() {
  return passport.authenticate('google', {
    session: true,
    failureRedirect: `${config.clientUrl}/#/login?oauthError=true&errorMsg=Google%20sign-in%20failed`,
  });
}

export async function completeGoogleAuth(request, response) {
  const user = request.user;

  if (!user) {
    return response.redirect(`${config.clientUrl}/#/login?oauthError=true&errorMsg=Google%20sign-in%20failed`);
  }

  await setRefreshSession(response, user);
  const accessToken = generateAccessToken(user);
  const redirectUrl = `${config.clientUrl}/#/auth/callback?accessToken=${encodeURIComponent(accessToken)}`;

  return response.redirect(redirectUrl);
}

export async function me(request, response) {
  return response.json(sanitizeUser(request.user));
}

export async function adminOnly(request, response) {
  return response.json({
    message: 'Admin access granted.',
    user: sanitizeUser(request.user),
  });
}
