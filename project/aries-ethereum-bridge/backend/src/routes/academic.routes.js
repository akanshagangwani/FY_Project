import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
    createSchema,
    issueCredential,
    verifyCredential,
    deployContract,
    checkHealth,
    getConnections,
    sendInvitationToUser,  
    acceptUserInvitation, 
    getConnectionStatus,
} from '../controllers/academic.controller.js';

import validate from '../middleware/validate.js';
import { createSchema as createSchemaValidation } from '../validation/academic.validation.js';

const router = express.Router();

// health check of aries
router.get('/health', checkHealth);

// Connection management
router.post('/connections/accept-invitation', authenticate, acceptUserInvitation);
router.get('/connections',authenticate, getConnections);

router.post('/connections/send-invitation', authenticate, sendInvitationToUser);
router.get('/connections/:connectionId/status', authenticate, getConnectionStatus);


// Create schema
router.post('/schema', validate({ body: createSchemaValidation }), createSchema);

// Issue credential
router.post('/credential', authenticate,issueCredential);

// Verify credential
router.get('/credential/:credentialId',authenticate, verifyCredential);

// Deploy smart contract
router.post('/contract/deploy', deployContract);

// Create invitation for connection


export default router;