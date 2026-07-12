const Telemetry = require('../models/Telemetry');
const helmetService = require('./helmetService');
const { eventBus, EVENTS } = require('../events/eventBus');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

const createTelemetry = async (telemetryData) => {
  const startTime = Date.now();

  /* Normalize ESP32 field names */
  const rawId = telemetryData.helmetId || telemetryData.helmetID;
  const helmetId = String(rawId).trim();
  const batteryLevel = telemetryData.batteryLevel ?? null;
  const packetNumber = telemetryData.packetNumber || telemetryData.packet || null;
  const bodyTemperature = telemetryData.bodyTemperature ?? telemetryData.temperature ?? null;
  const heartRate = telemetryData.heartRate ?? null;
  const spo2 = telemetryData.spo2 ?? null;
  const gasLevel = telemetryData.gasLevel ?? telemetryData.mq6 ?? null;
  const latitude = telemetryData.latitude ?? null;
  const longitude = telemetryData.longitude ?? null;

  const helmet = await helmetService.getHelmetById(helmetId);

  const telemetry = await Telemetry.create({
    helmetId,
    heartRate,
    spo2,
    bodyTemperature,
    gasLevel,
    latitude,
    longitude,
    batteryLevel,
    packetNumber,
    receivedAt: new Date(),
    timestamp: telemetryData.timestamp ? new Date(telemetryData.timestamp) : new Date(),
    rawPayload: telemetryData,
    /* ESP32 extra fields */
    humidity: telemetryData.humidity ?? null,
    mq6: telemetryData.mq6 ?? null,
    mq4: telemetryData.mq4 ?? null,
    mq8: telemetryData.mq8 ?? null,
    worker: telemetryData.worker || '',
    status: telemetryData.status || '',
    sos: telemetryData.sos ? true : false,
    latency: telemetryData.latency ?? null,
    packetLoss: telemetryData.packetLoss ?? null,
    gatewayRSSI: telemetryData.gatewayRSSI ?? null,
    relayRSSI: telemetryData.relayRSSI ?? null,
    gatewayDistance: telemetryData.gatewayDistance ?? null,
    relayDistance: telemetryData.relayDistance ?? null,
    gatewaySignal: telemetryData.gatewaySignal ?? null,
    relaySignal: telemetryData.relaySignal ?? null,
    helmetOnline: telemetryData.helmetOnline ? true : false,
    relayOnline: telemetryData.relayOnline ? true : false,
    gatewayOnline: telemetryData.gatewayOnline ? true : false,
  });

  telemetry.processingTime = Date.now() - startTime;
  await telemetry.save();

  await helmetService.updateHelmetLastSeen(helmetId, batteryLevel);

  if (helmet.deviceStatus !== 'online') {
    await helmetService.updateHelmet(helmetId, { deviceStatus: 'online' });
  }

  eventBus.emit(EVENTS.TELEMETRY_STORED, { telemetry });

  logger.info({ helmetId, packetNumber, bodyTemperature, gasLevel, processingTime: telemetry.processingTime }, 'Telemetry received');

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
