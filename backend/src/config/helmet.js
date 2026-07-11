module.exports = {
  defaults: {
    deviceStatus: 'offline',
    minerName: '',
    firmwareVersion: '',
  },
  offlineTimeoutMs: parseInt(process.env.OFFLINE_TIMEOUT_MS, 10) || 30000,
};
