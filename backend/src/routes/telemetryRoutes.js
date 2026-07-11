const { Router } = require('express');
const {
  createTelemetry,
  getLatestTelemetry,
  getTelemetryHistory,
} = require('../controllers/telemetryController');
const { validateTelemetry } = require('../validators/telemetryValidator');

const router = Router();

router.post('/', validateTelemetry, createTelemetry);
router.get('/latest/:helmetId', getLatestTelemetry);
router.get('/history/:helmetId', getTelemetryHistory);

module.exports = router;
