const dotenv = require('dotenv');

dotenv.config();

const database = require('./database');
const socketConfig = require('./socket');
const helmetConfig = require('./helmet');
const thresholds = require('./thresholds');

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appVersion: process.env.npm_package_version || '1.0.0',
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  mongodbUri: database.mongodbUri,
  socket: socketConfig,
  helmet: helmetConfig,
  thresholds,
};

const validateEnv = () => {
  const errors = [];

  if (!process.env.MONGODB_URI) {
    errors.push('MONGODB_URI is not set. Using default: mongodb://localhost:27017/kavach');
  }

  const port = parseInt(process.env.PORT, 10);
  if (process.env.PORT && (isNaN(port) || port < 1 || port > 65535)) {
    errors.push(`PORT must be a valid port number (1-65535), got: ${process.env.PORT}`);
  }

  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    errors.push(`NODE_ENV should be one of: development, production, test. Got: ${process.env.NODE_ENV}`);
  }

  if (errors.length > 0) {
    console.error('Environment configuration warnings:');
    errors.forEach((e) => console.error(`  - ${e}`));
  }
};

module.exports = config;
module.exports.validateEnv = validateEnv;
