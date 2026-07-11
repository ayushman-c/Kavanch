const Alert = require('../models/Alert');
const Helmet = require('../models/Helmet');
const { thresholds, helmet: helmetConfig } = require('../config');
const { getIO } = require('../sockets');
const { broadcastAlertNew, broadcastAlertResolved } = require('../sockets/alert.socket');
const logger = require('../utils/logger');

const getActiveAlert = async (helmetId, type) => {
  return Alert.findOne({ helmetId, type, status: 'active' }).lean();
};

const resolveAlert = async (alert) => {
  alert.status = 'resolved';
  await alert.save();

  try {
    const io = getIO();
    broadcastAlertResolved(io, alert);
  } catch (e) {
    logger.debug('Socket.IO not available for alert:resolved broadcast');
  }

  return alert;
};

const createAlert = async (helmetId, type, severity, message) => {
  const existing = await getActiveAlert(helmetId, type);
  if (existing) {
    return existing;
  }

  const alert = await Alert.create({
    helmetId,
    type,
    severity,
    message,
    status: 'active',
    timestamp: new Date(),
  });

  logger.warn({ helmetId, type, severity, message }, 'Alert generated');

  try {
    const io = getIO();
    broadcastAlertNew(io, alert);
  } catch (e) {
    logger.debug('Socket.IO not available for alert:new broadcast');
  }

  return alert;
};

const checkGasLevel = async (helmetId, gasLevel) => {
  if (gasLevel === null || gasLevel === undefined) return null;

  if (gasLevel >= thresholds.GAS_LEVEL_MAX) {
    return createAlert(
      helmetId,
      'gas_leak',
      gasLevel >= thresholds.CRITICAL_GAS_LEVEL ? 'critical' : 'high',
      `High gas level detected: ${gasLevel}`
    );
  }

  const active = await getActiveAlert(helmetId, 'gas_leak');
  if (active) {
    return resolveAlert(active);
  }

  return null;
};

const checkBodyTemperature = async (helmetId, temperature) => {
  if (temperature === null || temperature === undefined) return null;

  if (temperature >= thresholds.BODY_TEMPERATURE_MAX) {
    return createAlert(
      helmetId,
      'high_temperature',
      temperature >= thresholds.CRITICAL_BODY_TEMPERATURE ? 'critical' : 'high',
      `High body temperature detected: ${temperature}°C`
    );
  }

  const active = await getActiveAlert(helmetId, 'high_temperature');
  if (active) {
    return resolveAlert(active);
  }

  return null;
};

const checkHeartRate = async (helmetId, heartRate) => {
  if (heartRate === null || heartRate === undefined) return null;

  if (heartRate < thresholds.HEART_RATE_MIN || heartRate > thresholds.HEART_RATE_MAX) {
    const isCritical =
      heartRate < thresholds.CRITICAL_HEART_RATE_MIN ||
      heartRate > thresholds.CRITICAL_HEART_RATE_MAX;

    return createAlert(
      helmetId,
      'abnormal_heart_rate',
      isCritical ? 'critical' : 'high',
      `Abnormal heart rate detected: ${heartRate} bpm`
    );
  }

  const active = await getActiveAlert(helmetId, 'abnormal_heart_rate');
  if (active) {
    return resolveAlert(active);
  }

  return null;
};

const checkSpO2 = async (helmetId, spo2) => {
  if (spo2 === null || spo2 === undefined) return null;

  if (spo2 < thresholds.SPO2_MIN) {
    return createAlert(
      helmetId,
      'low_oxygen',
      spo2 < thresholds.CRITICAL_SPO2 ? 'critical' : 'high',
      `Low oxygen level detected: ${spo2}% SpO2`
    );
  }

  const active = await getActiveAlert(helmetId, 'low_oxygen');
  if (active) {
    return resolveAlert(active);
  }

  return null;
};

const checkBattery = async (helmetId, batteryLevel) => {
  if (batteryLevel === null || batteryLevel === undefined) return null;

  if (batteryLevel < thresholds.BATTERY_MIN) {
    return createAlert(
      helmetId,
      'low_battery',
      'medium',
      `Low battery: ${batteryLevel}%`
    );
  }

  const active = await getActiveAlert(helmetId, 'low_battery');
  if (active) {
    return resolveAlert(active);
  }

  return null;
};

const checkHelmetOffline = async () => {
  const timeout = new Date(Date.now() - helmetConfig.offlineTimeoutMs);
  const helmets = await Helmet.find({
    deviceStatus: 'online',
    lastSeen: { $lt: timeout },
  });

  for (const helmet of helmets) {
    helmet.deviceStatus = 'offline';
    await helmet.save();

    logger.warn({ helmetId: helmet.helmetId }, 'Helmet marked offline');

    await createAlert(
      helmet.helmetId,
      'helmet_offline',
      'high',
      `Helmet ${helmet.helmetId} went offline. Last seen: ${helmet.lastSeen.toISOString()}`
    );
  }
};

const analyzeTelemetry = async (telemetry) => {
  const { helmetId, gasLevel, bodyTemperature, heartRate, spo2, batteryLevel } = telemetry;

  const results = await Promise.all([
    checkGasLevel(helmetId, gasLevel),
    checkBodyTemperature(helmetId, bodyTemperature),
    checkHeartRate(helmetId, heartRate),
    checkSpO2(helmetId, spo2),
    checkBattery(helmetId, batteryLevel),
  ]);

  return results.filter(Boolean);
};

const startOfflineMonitor = () => {
  checkHelmetOffline();
  setInterval(checkHelmetOffline, helmetConfig.offlineTimeoutMs);
  logger.info('Offline helmet monitor started');
};

module.exports = {
  analyzeTelemetry,
  startOfflineMonitor,
  createAlert,
  resolveAlert,
  getActiveAlert,
};
