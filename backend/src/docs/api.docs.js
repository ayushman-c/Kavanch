/**
 * @openapi
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
 *
 *     Helmet:
 *       type: object
 *       properties:
 *         helmetId:
 *           type: string
 *         minerName:
 *           type: string
 *         deviceStatus:
 *           type: string
 *           enum: [online, offline, error]
 *         firmwareVersion:
 *           type: string
 *         lastSeen:
 *           type: string
 *           format: date-time
 *         batteryLevel:
 *           type: number
 *
 *     Telemetry:
 *       type: object
 *       properties:
 *         helmetId:
 *           type: string
 *         heartRate:
 *           type: number
 *         spo2:
 *           type: number
 *         bodyTemperature:
 *           type: number
 *         gasLevel:
 *           type: number
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         batteryLevel:
 *           type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     Alert:
 *       type: object
 *       properties:
 *         helmetId:
 *           type: string
 *         type:
 *           type: string
 *         severity:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, resolved, acknowledged]
 *         timestamp:
 *           type: string
 *           format: date-time
 *
 *     Emergency:
 *       type: object
 *       properties:
 *         helmetId:
 *           type: string
 *         emergencyType:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, resolved]
 *         startedAt:
 *           type: string
 *           format: date-time
 *         resolvedAt:
 *           type: string
 *           format: date-time
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Server health check
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                     database:
 *                       type: string
 *                     socketIO:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     environment:
 *                       type: string
 *                     version:
 *                       type: string
 */

/**
 * @openapi
 * /api/helmets:
 *   post:
 *     tags: [Helmets]
 *     summary: Register a new helmet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - helmetId
 *             properties:
 *               helmetId:
 *                 type: string
 *               minerName:
 *                 type: string
 *               firmwareVersion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Helmet registered
 *       409:
 *         description: Duplicate helmet
 *
 *   get:
 *     tags: [Helmets]
 *     summary: Get all helmets
 *     responses:
 *       200:
 *         description: List of helmets
 */

/**
 * @openapi
 * /api/helmets/{helmetId}:
 *   get:
 *     tags: [Helmets]
 *     summary: Get a helmet by ID
 *     parameters:
 *       - in: path
 *         name: helmetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Helmet data
 *       404:
 *         description: Helmet not found
 *
 *   put:
 *     tags: [Helmets]
 *     summary: Update helmet information
 *     parameters:
 *       - in: path
 *         name: helmetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minerName:
 *                 type: string
 *               deviceStatus:
 *                 type: string
 *                 enum: [online, offline, error]
 *               firmwareVersion:
 *                 type: string
 *               batteryLevel:
 *                 type: number
 *     responses:
 *       200:
 *         description: Helmet updated
 *       404:
 *         description: Helmet not found
 */

/**
 * @openapi
 * /api/telemetry:
 *   post:
 *     tags: [Telemetry]
 *     summary: Submit telemetry data from ESP32
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - helmetId
 *             properties:
 *               helmetId:
 *                 type: string
 *               heartRate:
 *                 type: number
 *               spo2:
 *                 type: number
 *               bodyTemperature:
 *                 type: number
 *               gasLevel:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               batteryLevel:
 *                 type: number
 *               packetNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Telemetry stored
 *       404:
 *         description: Helmet not found
 */

/**
 * @openapi
 * /api/telemetry/latest/{helmetId}:
 *   get:
 *     tags: [Telemetry]
 *     summary: Get latest telemetry for a helmet
 *     parameters:
 *       - in: path
 *         name: helmetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest telemetry
 *       404:
 *         description: No telemetry found
 */

/**
 * @openapi
 * /api/telemetry/history/{helmetId}:
 *   get:
 *     tags: [Telemetry]
 *     summary: Get paginated telemetry history
 *     parameters:
 *       - in: path
 *         name: helmetId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated telemetry records
 */

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard summary per helmet
 *     responses:
 *       200:
 *         description: Dashboard summary
 */

/**
 * @openapi
 * /api/dashboard/live:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get live dashboard data
 *     responses:
 *       200:
 *         description: Live data
 */

/**
 * @openapi
 * /api/dashboard/alerts:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get filtered/paginated alerts
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *       - in: query
 *         name: helmetId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated alerts
 */

/**
 * @openapi
 * /api/dashboard/emergencies:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get paginated emergencies
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: helmetId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated emergencies
 */

/**
 * @openapi
 * /api/analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Get analytics overview
 *     responses:
 *       200:
 *         description: Overview statistics
 */

/**
 * @openapi
 * /api/analytics/telemetry:
 *   get:
 *     tags: [Analytics]
 *     summary: Get telemetry analytics (min, max, avg)
 *     parameters:
 *       - in: query
 *         name: helmetId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Telemetry analytics
 */

/**
 * @openapi
 * /api/analytics/alerts:
 *   get:
 *     tags: [Analytics]
 *     summary: Get alert analytics by type, severity, and status
 *     responses:
 *       200:
 *         description: Alert analytics
 */

/**
 * @openapi
 * /api/analytics/emergencies:
 *   get:
 *     tags: [Analytics]
 *     summary: Get emergency analytics by type and status
 *     responses:
 *       200:
 *         description: Emergency analytics
 */
