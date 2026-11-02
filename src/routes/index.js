const { Router } = require('express');
const userRoutes = require('./user.routes');

const routes = Router();

// Health Check
routes.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'DigitalStore API',
    });
});

// Include other modules
routes.use('/users', userRoutes);

module.exports = routes;
