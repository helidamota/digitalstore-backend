require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

module.exports = app;
