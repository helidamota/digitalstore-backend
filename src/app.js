require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
<<<<<<< HEAD
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
=======
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const errorHandler = require('./middleware/errorHandler');
>>>>>>> 269ef077a291ce25e80c351b5a92064ff7b75c19

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
