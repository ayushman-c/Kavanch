const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KAVACH Mining Helmet API',
      version: '1.0.0',
      description: 'Backend API for the KAVACH Mining Helmet Monitoring System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/docs/*.docs.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
