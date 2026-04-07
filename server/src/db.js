import mysql from 'mysql2/promise';
import { config } from './config.js';

export const pool = mysql.createPool({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const schemaUpdates = [
  ['is_email_verified', "ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN NOT NULL DEFAULT FALSE"],
  ['email_verification_token', "ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255) NULL"],
  ['email_verification_expires_at', "ALTER TABLE users ADD COLUMN email_verification_expires_at DATETIME NULL"],
  ['password_reset_token', "ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255) NULL"],
  ['password_reset_expires_at', "ALTER TABLE users ADD COLUMN password_reset_expires_at DATETIME NULL"],
  ['refresh_token_hash', "ALTER TABLE users ADD COLUMN refresh_token_hash VARCHAR(255) NULL"],
  ['last_login_at', "ALTER TABLE users ADD COLUMN last_login_at DATETIME NULL"],
  ['avatar_url', "ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL"],
  ['full_name', "ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NULL"],
  ['auth_provider', "ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL'"],
  ['google_id', "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL"],
];

async function ensureColumn(columnName, alterStatement) {
  const [rows] = await pool.query(
    `SELECT 1
     FROM information_schema.columns
     WHERE table_schema = ?
       AND table_name = 'users'
       AND column_name = ?
     LIMIT 1`,
    [config.mysql.database, columnName]
  );

  if (rows.length === 0) {
    await pool.query(alterStatement);
  }
}

export async function connectDatabase() {
  await pool.query('SELECT 1');

  for (const [columnName, statement] of schemaUpdates) {
    await ensureColumn(columnName, statement);
  }

  await pool.query(`
    UPDATE users
    SET is_email_verified = TRUE
    WHERE auth_provider = 'GOOGLE' OR role = 'ADMIN'
  `);

  console.log('[auth] Connected to MySQL and ensured auth columns are available');
}
