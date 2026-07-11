const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analyticsService');
const { HTTP_STATUS } = require('../constants');

const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview();
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Analytics overview retrieved', data)
  );
});

const getTelemetry = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTelemetryAnalytics(req.query);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Telemetry analytics retrieved', data)
  );
});

const getAlerts = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAlertAnalytics();
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Alert analytics retrieved', data)
  );
});

const getEmergencies = asyncHandler(async (req, res) => {
  const data = await analyticsService.getEmergencyAnalytics();
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Emergency analytics retrieved', data)
  );
});

module.exports = {
  getOverview,
  getTelemetry,
  getAlerts,
  getEmergencies,
};
