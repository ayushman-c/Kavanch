const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const swaggerSpec = require('./docs/swagger');
const ApiError = require('./utils/ApiError');
const { HTTP_STATUS } = require('./constants');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'KAVACH API Docs',
}));

app.use(routes);

app.use((req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

module.exports = app;
