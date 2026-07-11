const Helmet = require('../models/Helmet');
const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');
const Emergency = require('../models/Emergency');

const getSummary = async () => {
  const helmets = await Helmet.find().sort({ createdAt: -1 }).lean();

  const summaries = await Promise.all(
    helmets.map(async (helmet) => {
      const lastTelemetry = await Telemetry.findOne({ helmetId: helmet.helmetId })
        .sort({ timestamp: -1 })
        .lean();

      const [activeAlertsCount, activeEmergenciesCount] = await Promise.all([
        Alert.countDocuments({ helmetId: helmet.helmetId, status: 'active' }),
        Emergency.countDocuments({ helmetId: helmet.helmetId, status: 'active' }),
      ]);

      return {
        helmetId: helmet.helmetId,
        minerName: helmet.minerName,
        deviceStatus: helmet.deviceStatus,
        batteryLevel: helmet.batteryLevel,
        lastSeen: helmet.lastSeen,
        lastTelemetry: lastTelemetry || null,
        activeAlertsCount,
        activeEmergenciesCount,
      };
    })
  );

  return summaries;
};

const getLive = async () => {
  const helmets = await Helmet.find().sort({ createdAt: -1 }).lean();

  const liveData = await Promise.all(
    helmets.map(async (helmet) => {
      const [currentTelemetry, activeAlerts, activeEmergency] = await Promise.all([
        Telemetry.findOne({ helmetId: helmet.helmetId })
          .sort({ timestamp: -1 })
          .lean(),
        Alert.find({ helmetId: helmet.helmetId, status: 'active' })
          .sort({ timestamp: -1 })
          .lean(),
        Emergency.findOne({ helmetId: helmet.helmetId, status: 'active' }).lean(),
      ]);

      return {
        helmetId: helmet.helmetId,
        minerName: helmet.minerName,
        deviceStatus: helmet.deviceStatus,
        batteryLevel: helmet.batteryLevel,
        lastSeen: helmet.lastSeen,
        currentTelemetry: currentTelemetry || null,
        activeAlerts,
        activeEmergency: activeEmergency || null,
      };
    })
  );

  return liveData;
};

const getAlerts = async (query = {}) => {
  const { page = 1, limit = 20, status, severity, helmetId, sortBy = 'timestamp', sortOrder = 'desc' } = query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (helmetId) filter.helmetId = helmetId;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [records, total] = await Promise.all([
    Alert.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Alert.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getEmergencies = async (query = {}) => {
  const { page = 1, limit = 20, status, helmetId } = query;

  const filter = {};
  if (status) filter.status = status;
  if (helmetId) filter.helmetId = helmetId;

  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Emergency.find(filter).sort({ startedAt: -1 }).skip(skip).limit(limit).lean(),
    Emergency.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getSummary,
  getLive,
  getAlerts,
  getEmergencies,
};
