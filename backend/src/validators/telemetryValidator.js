const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

const validateTelemetry = (req, res, next) => {
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

module.exports = { validateTelemetry };
