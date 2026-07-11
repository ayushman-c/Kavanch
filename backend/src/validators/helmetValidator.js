const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

const validateRegisterHelmet = (req, res, next) => {
  const { helmetId } = req.body;

  const errors = [];

  if (!helmetId || typeof helmetId !== 'string' || helmetId.trim().length === 0) {
    errors.push('helmetId is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors));
  }

  next();
};

const validateUpdateHelmet = (req, res, next) => {
  const allowedFields = ['minerName', 'deviceStatus', 'firmwareVersion', 'batteryLevel'];
  const bodyKeys = Object.keys(req.body);

  const errors = [];

  if (bodyKeys.length === 0) {
    errors.push('At least one field must be provided for update');
  }

  const invalidFields = bodyKeys.filter((key) => !allowedFields.includes(key));
  if (invalidFields.length > 0) {
    errors.push(`Invalid fields: ${invalidFields.join(', ')}`);
  }

  if (req.body.deviceStatus && !['online', 'offline', 'error'].includes(req.body.deviceStatus)) {
    errors.push('deviceStatus must be one of: online, offline, error');
  }

  if (req.body.batteryLevel !== undefined) {
    if (typeof req.body.batteryLevel !== 'number' || req.body.batteryLevel < 0 || req.body.batteryLevel > 100) {
      errors.push('batteryLevel must be a number between 0 and 100');
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors));
  }

  next();
};

module.exports = { validateRegisterHelmet, validateUpdateHelmet };
