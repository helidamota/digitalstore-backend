const { Router } = require('express');
const HealthController = require('../controllers/HealthController');

const routes = Router();

// Health Check
routes.get('/health', HealthController.index);

// Import other modules here
// const productRoutes = require('./product.routes');
// routes.use('/products', productRoutes);

module.exports = routes;
