const mongoose = require('mongoose');
const os = require('os');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants');
const config = require('../config');
const Helmet = require('../models/Helmet');
const { getIO } = require('../sockets');

const serverStartTime = Date.now();

const getHealth = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  let socketStatus = 'not_initialized';
  let connectedClients = 0;
  try {
    const io = getIO();
    socketStatus = 'connected';
    connectedClients = io.engine?.clientsCount || 0;
  } catch (e) {
    socketStatus = 'disconnected';
  }

  const [activeHelmets, totalHelmets] = await Promise.all([
    Helmet.countDocuments({ deviceStatus: 'online' }),
    Helmet.countDocuments(),
  ]);

  const memUsage = process.memoryUsage();
  const cpus = os.cpus();

  const db = mongoose.connection.db;
  let mongoVersion = null;
  try {
    if (db) {
      const admin = db.admin();
      const info = await admin.serverInfo();
      mongoVersion = info.version;
    }
  } catch (e) {
    // DB not connected
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Server is running', {
      server: 'running',
      database: dbStatus[dbState] || 'unknown',
      mongoVersion,
      socketIO: socketStatus,
      connectedClients,
      uptime: process.uptime(),
      serverStartTime: new Date(serverStartTime).toISOString(),
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      cpuCores: cpus.length,
      cpuLoad: os.loadavg ? os.loadavg() : [],
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
      },
      environment: config.nodeEnv,
      version: config.appVersion,
      activeHelmets,
      totalHelmets,
      timestamp: new Date().toISOString(),
    })
  );
});

module.exports = { getHealth };
