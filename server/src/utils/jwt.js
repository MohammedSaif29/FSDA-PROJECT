import jwt from 'jsonwebtoken';
import ms from 'ms';
import { config } from '../config.js';

export function generateAccessToken(user) {
  return jwt.sign(
    {
      role: user.role,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
    config.accessTokenSecret,
    {
      subject: String(user.id),
      expiresIn: config.accessTokenExpiresIn,
    }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { type: 'refresh' },
    config.refreshTokenSecret,
    {
      subject: String(user.id),
      expiresIn: config.refreshTokenExpiresIn,
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.accessTokenSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshTokenSecret);
}

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: ms(config.refreshTokenExpiresIn),
  };
}
