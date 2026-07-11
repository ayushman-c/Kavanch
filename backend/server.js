const http = require('http');
const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config');
const connectDB = require('./src/database/connection');
const { initSocketIO, getIO } = require('./src/sockets');
const { setupTelemetryEvents } = require('./src/events/telemetry.events');
const alertService = require('./src/services/alertService');
const logger = require('./src/utils/logger');

const start = async () => {
  config.validateEnv();

  logger.info({ env: config.nodeEnv, version: config.appVersion }, 'Server starting');

  await connectDB();

  const server = http.createServer(app);
  initSocketIO(server);

  setupTelemetryEvents();
  alertService.startOfflineMonitor();

  server.listen(config.port, () => {
    logger.info({ port: config.port }, 'Server running');
  });

  const gracefulShutdown = async (signal) => {
    logger.info({ signal }, 'Graceful shutdown initiated');

    server.close(() => {
      logger.info('HTTP server closed');
    });

    try {
      const io = getIO();
      io.close();
      logger.info('Socket.IO server closed');
    } catch (e) {
      logger.debug('Socket.IO was not initialized');
    }

    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    } catch (e) {
      logger.error({ err: e.message }, 'Error closing MongoDB connection');
    }

    process.exit(0);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

start().catch((err) => {
  logger.error({ err: err.message }, 'Failed to start server');
  process.exit(1);
});
