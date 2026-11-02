const { Router } = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');

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
routes.use('/v1/user', authRoutes);
routes.use('/v1/category', categoryRoutes);
routes.use('/v1/product', productRoutes);

module.exports = routes;
