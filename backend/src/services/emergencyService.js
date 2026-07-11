const Emergency = require('../models/Emergency');
const { thresholds } = require('../config');
const { getIO } = require('../sockets');
const { broadcastEmergencyNew, broadcastEmergencyResolved } = require('../sockets/emergency.socket');
const { getActiveAlert } = require('./alertService');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

const getActiveEmergency = async (helmetId) => {
  return Emergency.findOne({ helmetId, status: 'active' }).lean();
};

const createEmergency = async (helmetId, emergencyType) => {
  const existing = await getActiveEmergency(helmetId);
  if (existing) {
    return existing;
  }

  const emergency = await Emergency.create({
    helmetId,
    emergencyType,
    status: 'active',
    startedAt: new Date(),
    resolvedAt: null,
  });

  logger.error({ helmetId, emergencyType }, 'Emergency created');

  try {
    const io = getIO();
    broadcastEmergencyNew(io, emergency);
  } catch (e) {
    logger.debug('Socket.IO not available for emergency:new broadcast');
  }

  return emergency;
};

const resolveEmergency = async (helmetId) => {
  const emergency = await getActiveEmergency(helmetId);
  if (!emergency) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, `No active emergency for helmet ${helmetId}`);
  }

  emergency.status = 'resolved';
  emergency.resolvedAt = new Date();
  await emergency.save();

  logger.info({ helmetId, emergencyType: emergency.emergencyType }, 'Emergency resolved');

  try {
    const io = getIO();
    broadcastEmergencyResolved(io, emergency);
  } catch (e) {
    logger.debug('Socket.IO not available for emergency:resolved broadcast');
  }

  return emergency;
};

const checkAndCreateEmergency = async (helmetId, telemetry) => {
  const { gasLevel, bodyTemperature, heartRate, spo2 } = telemetry;

  const isCriticalGas = gasLevel !== null && gasLevel !== undefined && gasLevel >= thresholds.CRITICAL_GAS_LEVEL;
  const isCriticalTemp = bodyTemperature !== null && bodyTemperature !== undefined && bodyTemperature >= thresholds.CRITICAL_BODY_TEMPERATURE;
  const isCriticalHR = heartRate !== null && heartRate !== undefined && (heartRate < thresholds.CRITICAL_HEART_RATE_MIN || heartRate > thresholds.CRITICAL_HEART_RATE_MAX);
  const isCriticalSpO2 = spo2 !== null && spo2 !== undefined && spo2 < thresholds.CRITICAL_SPO2;

  if (isCriticalGas) {
    return createEmergency(helmetId, 'gas_leak');
  }

  if (isCriticalTemp) {
    return createEmergency(helmetId, 'high_temperature');
  }

  if (isCriticalHR) {
    return createEmergency(helmetId, 'fall');
  }

  if (isCriticalSpO2) {
    return createEmergency(helmetId, 'fall');
  }

  const criticalAlerts = await Promise.all([
    getActiveAlert(helmetId, 'gas_leak'),
    getActiveAlert(helmetId, 'high_temperature'),
    getActiveAlert(helmetId, 'abnormal_heart_rate'),
    getActiveAlert(helmetId, 'low_oxygen'),
  ]);

  const activeCritical = criticalAlerts.filter(
    (a) => a && a.severity === 'critical'
  );

  if (activeCritical.length >= 2) {
    return createEmergency(helmetId, 'fall');
  }

  const existingEmergency = await getActiveEmergency(helmetId);
  if (existingEmergency && !isCriticalGas && !isCriticalTemp && !isCriticalHR && !isCriticalSpO2 && activeCritical.length < 2) {
    return resolveEmergency(helmetId);
  }

  return null;
};

const getActiveEmergencies = async () => {
  return Emergency.find({ status: 'active' }).sort({ startedAt: -1 }).lean();
};

const getEmergencyHistory = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Emergency.find().sort({ startedAt: -1 }).skip(skip).limit(limit).lean(),
    Emergency.countDocuments(),
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
  createEmergency,
  resolveEmergency,
  checkAndCreateEmergency,
  getActiveEmergencies,
  getEmergencyHistory,
  getActiveEmergency,
};
