import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.PORT);
// Import routes
import Routes from './routes/index.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/sonalimkc', Routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'aries-backend' });
});

// Error handling middleware
app.use(errorHandler);

export default app;