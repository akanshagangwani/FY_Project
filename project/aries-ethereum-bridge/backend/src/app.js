import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import ariesRoutes from './routes/aries.routes.js';
import credentialRoutes from './routes/credential.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/aries', ariesRoutes);
app.use('/api/credentials', credentialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'aries-backend' });
});

// Error handling middleware
app.use(errorHandler);

export default app;