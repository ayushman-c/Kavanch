const { Server } = require('socket.io');
const config = require('../config');
const logger = require('../utils/logger');

let io = null;

const initSocketIO = (server) => {
  io = new Server(server, {
    cors: config.socket.cors,
  });

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Client connected');

    socket.on('join:room', (room) => {
      if (typeof room === 'string' && room.length > 0) {
        socket.join(room);
        logger.debug({ socketId: socket.id, room }, 'Client joined room');
      }
    });

    socket.on('leave:room', (room) => {
      if (typeof room === 'string' && room.length > 0) {
        socket.leave(room);
        logger.debug({ socketId: socket.id, room }, 'Client left room');
      }
    });

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Client disconnected');
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initSocketIO, getIO };
