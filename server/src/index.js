import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { config } from './config.js';
import { connectDatabase } from './db.js';
import { configurePassport } from './passport.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));
app.use(session({
  name: 'eduvault.sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  proxy: config.isProduction,
  cookie: {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/auth/health', (_request, response) => {
  response.json({
    service: 'EduVault Auth Service',
    status: 'UP',
    provider: 'MySQL',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`[auth] Auth service listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('[auth] Failed to start auth server:', error);
    process.exit(1);
  }
}

startServer();
