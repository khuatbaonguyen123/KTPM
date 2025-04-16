import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  if (io) {
    console.warn("Socket.io is already initialized.");
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on('connection', (socket) => {
    console.log('A client connected: ' + socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected: ' + socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized! Call initSocket(server) first.");
  }
  return io;
};
