const { Router } = require('express');
const {
  getSummary,
  getLive,
  getAlerts,
  getEmergencies,
} = require('../controllers/dashboardController');

const router = Router();

router.get('/summary', getSummary);
router.get('/live', getLive);
router.get('/alerts', getAlerts);
router.get('/emergencies', getEmergencies);

module.exports = router;
