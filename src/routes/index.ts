import { Router } from 'express';
import healthController from '@modules/health/controllers/HealthController';

const routes = Router();

// Health Check
routes.get('/health', healthController.index.bind(healthController));

// Import other modules here
// import productRoutes from '@modules/products/routes/product.routes';
// routes.use('/products', productRoutes);

export { routes };
