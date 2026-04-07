import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import fs from 'fs';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { initializeSocket } from './config/socket';
import { requestLogger } from './middleware/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';
import * as authService from './services/authService';

const app = express();
const httpServer = http.createServer(app);

initializeSocket(httpServer);

const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger);

app.use('/uploads', express.static(uploadDir));

if (env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const result = await authService.googleAuth(profile);
          done(null, result);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}
app.use(passport.initialize());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

async function start(): Promise<void> {
  await connectDatabase();

  const PORT = parseInt(env.PORT, 10);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    console.log(`📡 Socket.io enabled`);
    console.log(`🔗 API available at http://localhost:${PORT}/api`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
