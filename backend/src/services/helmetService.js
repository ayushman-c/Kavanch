const Helmet = require('../models/Helmet');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

const registerHelmet = async (helmetData) => {
  const existing = await Helmet.findOne({ helmetId: helmetData.helmetId });
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, `Helmet ${helmetData.helmetId} already exists`);
  }

  const helmet = await Helmet.create(helmetData);
  return helmet;
};

const getAllHelmets = async () => {
  const helmets = await Helmet.find().sort({ createdAt: -1 }).lean();
  return helmets;
};

const getHelmetById = async (helmetId) => {
  const helmet = await Helmet.findOne({ helmetId }).lean();
  if (!helmet) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, `Helmet ${helmetId} not found`);
  }
  return helmet;
};

const updateHelmet = async (helmetId, updateData) => {
  const helmet = await Helmet.findOne({ helmetId });
  if (!helmet) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, `Helmet ${helmetId} not found`);
  }

  Object.assign(helmet, updateData);
  await helmet.save();
  return helmet;
};

const updateHelmetLastSeen = async (helmetId, batteryLevel) => {
  const update = { lastSeen: new Date() };
  if (batteryLevel !== undefined && batteryLevel !== null) {
    update.batteryLevel = batteryLevel;
  }

  await Helmet.findOneAndUpdate({ helmetId }, update);
};

module.exports = {
  registerHelmet,
  getAllHelmets,
  getHelmetById,
  updateHelmet,
  updateHelmetLastSeen,
};
