const { Router } = require('express');
const {
  getOverview,
  getTelemetry,
  getAlerts,
  getEmergencies,
} = require('../controllers/analyticsController');

const router = Router();

router.get('/overview', getOverview);
router.get('/telemetry', getTelemetry);
router.get('/alerts', getAlerts);
router.get('/emergencies', getEmergencies);

module.exports = router;
