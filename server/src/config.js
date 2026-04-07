import dotenv from 'dotenv';

dotenv.config();

const splitCsv = (value = '') => value.split(',').map((item) => item.trim()).filter(Boolean);

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mysql: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0203',
    database: process.env.DB_NAME || 'eduvault',
  },
  sessionSecret: process.env.SESSION_SECRET || 'replace-me-with-a-long-random-session-secret',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'replace-me-with-a-long-random-access-secret',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'replace-me-with-a-long-random-refresh-secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  emailFrom: process.env.EMAIL_FROM || 'EduVault <no-reply@eduvault.app>',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
  },
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
    minimumScore: Number(process.env.RECAPTCHA_MINIMUM_SCORE || 0.5),
  },
  adminEmails: splitCsv(process.env.ADMIN_EMAILS).map((email) => email.toLowerCase()),
  allowedOrigins: splitCsv(process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173'),
  cookieName: process.env.REFRESH_COOKIE_NAME || 'eduvault_refresh',
};
