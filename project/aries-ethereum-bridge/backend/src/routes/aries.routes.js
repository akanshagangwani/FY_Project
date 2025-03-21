import express from 'express';
import { getStatus, getConnections, createSchema, createCredentialDefinition } from '../controllers/aries.controller.js';
import authenticate  from '../middleware/authenticate.js';

const router = express.Router();

// Public routes
router.get('/status', getStatus);

// Protected routes
router.get('/connections', authenticate, getConnections);
router.post('/schemas', authenticate, createSchema);
router.post('/credential-definitions', authenticate, createCredentialDefinition);

export default router;