import express from 'express';
import http from 'http';
import { initSocket } from '../../config/socket.js';
import 'dotenv/config';
import { setupSocketSubscriber } from './handler.js';

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

// Khởi động lắng nghe Redis và emit socket
setupSocketSubscriber();

// Start server
const PORT = process.env.SOCKET_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket Subscriber server is running on port ${PORT}`);
});
