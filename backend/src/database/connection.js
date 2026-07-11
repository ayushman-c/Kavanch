const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      bufferTimeoutMS: config.nodeEnv === 'test' ? 1000 : 10000,
      serverSelectionTimeoutMS: config.nodeEnv === 'test' ? 2000 : 5000,
    });
    logger.info({ host: conn.connection.host }, 'MongoDB connected');
    return conn;
  } catch (error) {
    logger.error({ err: error.message }, 'MongoDB connection error');
    if (config.nodeEnv !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
