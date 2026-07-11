const pino = require('pino');

let loggerInstance = null;

const createLogger = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  return pino({
    level: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
    ...(nodeEnv !== 'production' && {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss.l' },
      },
    }),
  });
};

const getLogger = () => {
  if (!loggerInstance) {
    loggerInstance = createLogger();
  }
  return loggerInstance;
};

module.exports = getLogger();
