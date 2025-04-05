import express from 'express';
import {
    createSchema,
    issueCredential,
    verifyCredential,
    deployContract,
    storeCredential,
    checkHealth,
} from '../controllers/academic.controller.js';
import validate from '../middleware/validate.js';
import { createSchema as createSchemaValidation } from '../validation/academic.validation.js';

const router = express.Router();

// health check of aries
router.get('/health', checkHealth);

// Create schema
router.post('/schema', validate({ body: createSchemaValidation }), createSchema);

// Issue credential
router.post('/credential', issueCredential);

// Verify credential
router.get('/credential/:credentialId', verifyCredential);

// Deploy smart contract
router.post('/contract/deploy', deployContract);

// Store credential hash
router.post('/credential/store', storeCredential);

export default router;