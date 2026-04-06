import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { initializeDatabase, pool } from './db.js';

const app = express();

app.use(cors({
  origin: [config.corsOrigin, 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/auth/health', (_request, response) => {
  response.json({
    service: 'EduVault Node Auth',
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/register', async (request, response) => {
  const { username, email, password, confirmPassword } = request.body;
  console.log('[auth][register] Incoming request for email:', email);

  if (!username?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
    return response.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ error: 'Password and confirm password must match.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return response.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
      [normalizedUsername, normalizedEmail, hashedPassword, 'STUDENT', createdAt]
    );

    console.log('[auth][register] User created with id:', result.insertId);

    return response.status(201).json({
      message: 'Account created successfully. Please sign in.',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('[auth][register] Failed:', error);
    return response.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body;
  console.log('[auth][login] Incoming request for email:', email);

  if (!email?.trim() || !password?.trim()) {
    return response.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const [rows] = await pool.query(
      'SELECT id, username, email, password, role FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return response.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return response.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({}, config.jwt.secret, {
      subject: user.username,
      expiresIn: config.jwt.expiresIn,
    });

    console.log('[auth][login] Login successful for user:', user.username);

    return response.json({
      message: 'Login successful.',
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'STUDENT',
    });
  } catch (error) {
    console.error('[auth][login] Failed:', error);
    return response.status(500).json({ error: 'Login failed due to a server error.' });
  }
});

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(config.port, () => {
      console.log(`[auth] EduVault auth server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('[auth] Failed to start auth server:', error);
    process.exit(1);
  }
}

startServer();
