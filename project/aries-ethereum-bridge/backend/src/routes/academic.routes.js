import express from 'express';
import { getSchemaByUsernameAndLabelController } from '../controllers/academic.controller.js';
import {
        saveStudentCredentialValidation,
        addAttributesValidation,
    } from '../validation/academic.validation.js';
import { saveCredentialController, addAttributesController } from '../controllers/academic.controller.js';
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
import { listSchemasByUsernameController } from '../controllers/academic.controller.js';
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

// Route to save a student credential
router.post('/save-schema',authenticate, saveCredentialController);

// Route to add attributes to an existing credential
router.post('/add-attributes',authenticate, addAttributesController);

// Route to fetch a schema by username and label
router.get('/get-schema', authenticate, getSchemaByUsernameAndLabelController);

// Route to list all schemas under a username
router.get('/list-schemas', authenticate, listSchemasByUsernameController);

export default router;