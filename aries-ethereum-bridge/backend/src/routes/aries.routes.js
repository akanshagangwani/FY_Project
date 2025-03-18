import express from 'express';
import { getStatus, getConnections, createSchema, createCredentialDefinition } from '../controllers/aries.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/status', getStatus);

// Protected routes
router.get('/connections', verifyToken, getConnections);
router.post('/schemas', verifyToken, createSchema);
router.post('/credential-definitions', verifyToken, createCredentialDefinition);

export default router;