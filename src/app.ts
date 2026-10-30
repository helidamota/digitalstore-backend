import express, { Application } from 'express';
import { routes } from './routes';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const app: Application = express();

// Middleware
app.use(express.json());

// Swagger Documentation
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api', routes);

// Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

export default app;
