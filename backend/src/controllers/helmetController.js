const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const helmetService = require('../services/helmetService');
const { HTTP_STATUS } = require('../constants');

const registerHelmet = asyncHandler(async (req, res) => {
  const helmet = await helmetService.registerHelmet(req.body);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, 'Helmet registered successfully', helmet)
  );
});

const getAllHelmets = asyncHandler(async (req, res) => {
  const helmets = await helmetService.getAllHelmets();
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Helmets retrieved successfully', helmets)
  );
});

const getHelmetById = asyncHandler(async (req, res) => {
  const helmet = await helmetService.getHelmetById(req.params.helmetId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Helmet retrieved successfully', helmet)
  );
});

const updateHelmet = asyncHandler(async (req, res) => {
  const helmet = await helmetService.updateHelmet(req.params.helmetId, req.body);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Helmet updated successfully', helmet)
  );
});

module.exports = {
  registerHelmet,
  getAllHelmets,
  getHelmetById,
  updateHelmet,
};
