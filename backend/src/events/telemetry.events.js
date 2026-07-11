const { eventBus, EVENTS } = require('./eventBus');
const { getIO } = require('../sockets');
const { broadcastTelemetryUpdate } = require('../sockets/telemetry.socket');
const alertService = require('../services/alertService');
const emergencyService = require('../services/emergencyService');
const logger = require('../utils/logger');

const setupTelemetryEvents = () => {
  eventBus.on(EVENTS.TELEMETRY_STORED, async ({ telemetry }) => {
    try {
      const io = getIO();
      broadcastTelemetryUpdate(io, telemetry);
    } catch (e) {
      logger.debug('Socket.IO not available for telemetry broadcast');
    }

    try {
      await alertService.analyzeTelemetry(telemetry);
    } catch (e) {
      logger.error({ err: e.message, helmetId: telemetry.helmetId }, 'Alert analysis failed');
    }

    try {
      await emergencyService.checkAndCreateEmergency(telemetry.helmetId, telemetry);
    } catch (e) {
      logger.error({ err: e.message, helmetId: telemetry.helmetId }, 'Emergency check failed');
    }
  });

  logger.info('Telemetry event handlers registered');
};

module.exports = { setupTelemetryEvents };
