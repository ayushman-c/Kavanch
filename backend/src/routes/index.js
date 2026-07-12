const { Router } = require('express');
const healthRoutes = require('./healthRoutes');
const helmetRoutes = require('./helmetRoutes');
const telemetryRoutes = require('./telemetryRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/helmets', helmetRoutes);
router.use('/api/telemetry', telemetryRoutes);
router.use('/api/helmet', telemetryRoutes);
router.use('/api/dashboard', dashboardRoutes);
router.use('/api/analytics', analyticsRoutes);

module.exports = router;
