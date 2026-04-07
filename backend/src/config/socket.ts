import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from './env';
import { verifyAccessToken } from '../utils/jwt';

export let io: SocketIOServer;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    try {
      const payload = verifyAccessToken(token);
      (socket as Socket & { userId: string }).userId = payload.userId;
      next();
    } catch {
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    const typedSocket = socket as Socket & { userId: string };
    console.log(`Socket connected: ${typedSocket.userId}`);

    socket.on('join_project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${typedSocket.userId} joined project room: ${projectId}`);
    });

    socket.on('leave_project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('join_user_room', () => {
      socket.join(`user:${typedSocket.userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${typedSocket.userId}`);
    });
  });

  return io;
}

export function emitToProject(projectId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`project:${projectId}`).emit(event, data);
  }
}

export function emitToUser(userId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}
