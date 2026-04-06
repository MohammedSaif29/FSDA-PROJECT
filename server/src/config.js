import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  mysql: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0203',
    database: process.env.DB_NAME || 'eduvault',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'EduVaultJwtSecretKeyForLocalDevelopment2026Secure',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
