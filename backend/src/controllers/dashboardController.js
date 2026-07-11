const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const dashboardService = require('../services/dashboardService');
const { HTTP_STATUS } = require('../constants');

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Dashboard summary retrieved', data)
  );
});

const getLive = asyncHandler(async (req, res) => {
  const data = await dashboardService.getLive();
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Live dashboard data retrieved', data)
  );
});

const getAlerts = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAlerts(req.query);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Alerts retrieved', data)
  );
});

const getEmergencies = asyncHandler(async (req, res) => {
  const data = await dashboardService.getEmergencies(req.query);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Emergencies retrieved', data)
  );
});

module.exports = {
  getSummary,
  getLive,
  getAlerts,
  getEmergencies,
};
