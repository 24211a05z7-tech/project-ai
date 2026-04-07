import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/constants';

let socket: Socket | null = null;

export const socketService = {
  connect: (token: string): Socket => {
    if (!socket) {
      socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
    }
    return socket;
  },
  disconnect: () => { if (socket) { socket.disconnect(); socket = null; } },
  getSocket: () => socket,
  on: (event: string, cb: (...args: unknown[]) => void) => socket?.on(event, cb),
  off: (event: string, cb?: (...args: unknown[]) => void) => socket?.off(event, cb),
  emit: (event: string, data?: unknown) => socket?.emit(event, data),
};
