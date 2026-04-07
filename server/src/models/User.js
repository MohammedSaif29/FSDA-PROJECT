import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const mapUser = (row) => {
  if (!row) return null;

  return {
    id: String(row.id),
    username: row.username,
    email: row.email,
    password: row.password,
    role: row.role === 'STUDENT' ? 'USER' : row.role,
    authProvider: row.auth_provider || 'LOCAL',
    googleId: row.google_id,
    avatarUrl: row.avatar_url || '',
    fullName: row.full_name || '',
    isEmailVerified: Boolean(row.is_email_verified),
    emailVerificationToken: row.email_verification_token,
    emailVerificationExpiresAt: row.email_verification_expires_at,
    passwordResetToken: row.password_reset_token,
    passwordResetExpiresAt: row.password_reset_expires_at,
    refreshTokenHash: row.refresh_token_hash,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  };
};

export async function findUserById(id, { includePassword = false } = {}) {
  const columns = includePassword ? '*' : 'id, username, email, role, auth_provider, google_id, avatar_url, full_name, is_email_verified, email_verification_token, email_verification_expires_at, password_reset_token, password_reset_expires_at, refresh_token_hash, last_login_at, created_at';
  const [rows] = await pool.query(`SELECT ${columns} FROM users WHERE id = ? LIMIT 1`, [id]);
  return mapUser(rows[0]);
}

export async function findUserByEmail(email, { includePassword = false } = {}) {
  const columns = includePassword ? '*' : 'id, username, email, role, auth_provider, google_id, avatar_url, full_name, is_email_verified, email_verification_token, email_verification_expires_at, password_reset_token, password_reset_expires_at, refresh_token_hash, last_login_at, created_at';
  const [rows] = await pool.query(`SELECT ${columns} FROM users WHERE email = ? LIMIT 1`, [email]);
  return mapUser(rows[0]);
}

export async function findUserByVerificationToken(email, tokenHash) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? AND email_verification_token = ? AND email_verification_expires_at > NOW() LIMIT 1`,
    [email, tokenHash]
  );
  return mapUser(rows[0]);
}

export async function findUserByResetToken(email, tokenHash) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? AND password_reset_token = ? AND password_reset_expires_at > NOW() LIMIT 1`,
    [email, tokenHash]
  );
  return mapUser(rows[0]);
}

export async function createUser(user) {
  const hashedPassword = user.password ? await bcrypt.hash(user.password, 12) : null;
  const [result] = await pool.query(
    `INSERT INTO users (
      username, email, password, role, auth_provider, google_id, avatar_url, full_name,
      is_email_verified, email_verification_token, email_verification_expires_at,
      password_reset_token, password_reset_expires_at, refresh_token_hash, last_login_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.username,
      user.email,
      hashedPassword,
      user.role === 'USER' ? 'USER' : user.role,
      user.authProvider || 'LOCAL',
      user.googleId || null,
      user.avatarUrl || null,
      user.fullName || null,
      user.isEmailVerified ? 1 : 0,
      user.emailVerificationToken || null,
      user.emailVerificationExpiresAt || null,
      user.passwordResetToken || null,
      user.passwordResetExpiresAt || null,
      user.refreshTokenHash || null,
      user.lastLoginAt || null,
    ]
  );

  return findUserById(result.insertId, { includePassword: true });
}

export async function updateUser(id, updates) {
  const assignments = [];
  const values = [];

  const fieldMap = {
    username: 'username',
    email: 'email',
    password: 'password',
    role: 'role',
    authProvider: 'auth_provider',
    googleId: 'google_id',
    avatarUrl: 'avatar_url',
    fullName: 'full_name',
    isEmailVerified: 'is_email_verified',
    emailVerificationToken: 'email_verification_token',
    emailVerificationExpiresAt: 'email_verification_expires_at',
    passwordResetToken: 'password_reset_token',
    passwordResetExpiresAt: 'password_reset_expires_at',
    refreshTokenHash: 'refresh_token_hash',
    lastLoginAt: 'last_login_at',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    if (!(key in updates)) continue;

    let value = updates[key];
    if (key === 'password' && value) {
      value = await bcrypt.hash(value, 12);
    }
    if (key === 'role' && value === 'STUDENT') {
      value = 'USER';
    }
    if (key === 'isEmailVerified') {
      value = value ? 1 : 0;
    }

    assignments.push(`${column} = ?`);
    values.push(value ?? null);
  }

  if (assignments.length === 0) {
    return findUserById(id, { includePassword: true });
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${assignments.join(', ')} WHERE id = ?`, values);
  return findUserById(id, { includePassword: true });
}

export async function comparePassword(candidatePassword, hashedPassword) {
  if (!hashedPassword) return false;
  return bcrypt.compare(candidatePassword, hashedPassword);
}
