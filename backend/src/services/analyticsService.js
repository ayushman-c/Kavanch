const Helmet = require('../models/Helmet');
const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');
const Emergency = require('../models/Emergency');

const getOverview = async () => {
  const [
    totalHelmets,
    onlineHelmets,
    offlineHelmets,
    totalAlerts,
    activeAlerts,
    resolvedAlerts,
    totalEmergencies,
    activeEmergencies,
    telemetryCount,
    telemetryAgg,
  ] = await Promise.all([
    Helmet.countDocuments(),
    Helmet.countDocuments({ deviceStatus: 'online' }),
    Helmet.countDocuments({ deviceStatus: 'offline' }),
    Alert.countDocuments(),
    Alert.countDocuments({ status: 'active' }),
    Alert.countDocuments({ status: 'resolved' }),
    Emergency.countDocuments(),
    Emergency.countDocuments({ status: 'active' }),
    Telemetry.countDocuments(),
    Telemetry.aggregate([
      {
        $group: {
          _id: null,
          avgBattery: { $avg: '$batteryLevel' },
          avgHeartRate: { $avg: '$heartRate' },
          avgSpO2: { $avg: '$spo2' },
          avgTemperature: { $avg: '$bodyTemperature' },
          avgGasLevel: { $avg: '$gasLevel' },
        },
      },
    ]),
  ]);

  const averages = telemetryAgg[0] || {};

  return {
    totalHelmets,
    onlineHelmets,
    offlineHelmets,
    totalAlerts,
    activeAlerts,
    resolvedAlerts,
    totalEmergencies,
    activeEmergencies,
    telemetryPackets: telemetryCount,
    averageBatteryLevel: averages.avgBattery
      ? Math.round(averages.avgBattery * 100) / 100
      : null,
    averageHeartRate: averages.avgHeartRate
      ? Math.round(averages.avgHeartRate * 100) / 100
      : null,
    averageSpO2: averages.avgSpO2
      ? Math.round(averages.avgSpO2 * 100) / 100
      : null,
    averageBodyTemperature: averages.avgTemperature
      ? Math.round(averages.avgTemperature * 100) / 100
      : null,
    averageGasLevel: averages.avgGasLevel
      ? Math.round(averages.avgGasLevel * 100) / 100
      : null,
  };
};

const getTelemetryAnalytics = async (query = {}) => {
  const { helmetId, startDate, endDate } = query;

  const match = {};
  if (helmetId) match.helmetId = helmetId;
  if (startDate || endDate) {
    match.timestamp = {};
    if (startDate) match.timestamp.$gte = new Date(startDate);
    if (endDate) match.timestamp.$lte = new Date(endDate);
  }

  const [stats, count] = await Promise.all([
    Telemetry.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          packetCount: { $sum: 1 },
          heartRateMin: { $min: '$heartRate' },
          heartRateMax: { $max: '$heartRate' },
          heartRateAvg: { $avg: '$heartRate' },
          spo2Min: { $min: '$spo2' },
          spo2Max: { $max: '$spo2' },
          spo2Avg: { $avg: '$spo2' },
          bodyTemperatureMin: { $min: '$bodyTemperature' },
          bodyTemperatureMax: { $max: '$bodyTemperature' },
          bodyTemperatureAvg: { $avg: '$bodyTemperature' },
          gasLevelMin: { $min: '$gasLevel' },
          gasLevelMax: { $max: '$gasLevel' },
          gasLevelAvg: { $avg: '$gasLevel' },
          batteryLevelMin: { $min: '$batteryLevel' },
          batteryLevelMax: { $max: '$batteryLevel' },
          batteryLevelAvg: { $avg: '$batteryLevel' },
        },
      },
    ]),
    Telemetry.countDocuments(match),
  ]);

  const s = stats[0] || {};

  return {
    packetCount: count,
    heartRate: {
      min: s.heartRateMin ?? null,
      max: s.heartRateMax ?? null,
      avg: s.heartRateAvg ? Math.round(s.heartRateAvg * 100) / 100 : null,
    },
    spo2: {
      min: s.spo2Min ?? null,
      max: s.spo2Max ?? null,
      avg: s.spo2Avg ? Math.round(s.spo2Avg * 100) / 100 : null,
    },
    bodyTemperature: {
      min: s.bodyTemperatureMin ?? null,
      max: s.bodyTemperatureMax ?? null,
      avg: s.bodyTemperatureAvg ? Math.round(s.bodyTemperatureAvg * 100) / 100 : null,
    },
    gasLevel: {
      min: s.gasLevelMin ?? null,
      max: s.gasLevelMax ?? null,
      avg: s.gasLevelAvg ? Math.round(s.gasLevelAvg * 100) / 100 : null,
    },
    batteryLevel: {
      min: s.batteryLevelMin ?? null,
      max: s.batteryLevelMax ?? null,
      avg: s.batteryLevelAvg ? Math.round(s.batteryLevelAvg * 100) / 100 : null,
    },
  };
};

const getAlertAnalytics = async () => {
  const [byType, bySeverity, activeVsResolved] = await Promise.all([
    Alert.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Alert.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Alert.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const formatAgg = (arr) =>
    arr.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

  return {
    byType: formatAgg(byType),
    bySeverity: formatAgg(bySeverity),
    byStatus: formatAgg(activeVsResolved),
  };
};

const getEmergencyAnalytics = async () => {
  const [byType, byStatus] = await Promise.all([
    Emergency.aggregate([
      { $group: { _id: '$emergencyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Emergency.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const formatAgg = (arr) =>
    arr.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

  return {
    byType: formatAgg(byType),
    byStatus: formatAgg(byStatus),
  };
};

module.exports = {
  getOverview,
  getTelemetryAnalytics,
  getAlertAnalytics,
  getEmergencyAnalytics,
};
