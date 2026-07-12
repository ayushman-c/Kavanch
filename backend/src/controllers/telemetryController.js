const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const telemetryService = require('../services/telemetryService');
const { HTTP_STATUS } = require('../constants');

const createTelemetry = asyncHandler(async (req, res) => {
  await telemetryService.createTelemetry(req.body);
  res.status(200).end();
});

const getLatestTelemetry = asyncHandler(async (req, res) => {
  const telemetry = await telemetryService.getLatestTelemetry(req.params.helmetId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Latest telemetry retrieved successfully', telemetry)
  );
});

const getTelemetryHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const result = await telemetryService.getTelemetryHistory(req.params.helmetId, page, limit);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Telemetry history retrieved successfully', result)
  );
});

module.exports = {
  createTelemetry,
  getLatestTelemetry,
  getTelemetryHistory,
};
