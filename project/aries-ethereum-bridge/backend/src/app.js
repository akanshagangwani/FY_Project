import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import dotenv from 'dotenv'
import { specs, swaggerUi } from './config/swagger.js';

dotenv.config()

// Import routes
import Routes from './routes/index.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base route for all API endpoints
app.use('/credex', Routes);

// Swagger documentation
app.use('/credex/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'credex-backend' });
});

// Error handling middleware
app.use(errorHandler);

export default app;