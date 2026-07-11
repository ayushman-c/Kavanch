const Telemetry = require('../models/Telemetry');
const helmetService = require('./helmetService');
const { eventBus, EVENTS } = require('../events/eventBus');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

const createTelemetry = async (telemetryData) => {
  const { helmetId, batteryLevel, packetNumber } = telemetryData;
  const startTime = Date.now();

  const helmet = await helmetService.getHelmetById(helmetId);

  const telemetry = await Telemetry.create({
    ...telemetryData,
    receivedAt: new Date(),
    timestamp: telemetryData.timestamp ? new Date(telemetryData.timestamp) : new Date(),
    rawPayload: telemetryData,
    packetNumber: packetNumber || null,
  });

  telemetry.processingTime = Date.now() - startTime;
  await telemetry.save();

  await helmetService.updateHelmetLastSeen(helmetId, batteryLevel);

  if (helmet.deviceStatus !== 'online') {
    await helmetService.updateHelmet(helmetId, { deviceStatus: 'online' });
  }

  eventBus.emit(EVENTS.TELEMETRY_STORED, { telemetry });

  return telemetry;
};

const getLatestTelemetry = async (helmetId) => {
  await helmetService.getHelmetById(helmetId);

  const telemetry = await Telemetry.findOne({ helmetId })
    .sort({ timestamp: -1 })
    .lean();
  if (!telemetry) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, `No telemetry found for helmet ${helmetId}`);
  }
  return telemetry;
};

const getTelemetryHistory = async (helmetId, page = 1, limit = 20) => {
  await helmetService.getHelmetById(helmetId);

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Telemetry.find({ helmetId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Telemetry.countDocuments({ helmetId }),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createTelemetry,
  getLatestTelemetry,
  getTelemetryHistory,
};
