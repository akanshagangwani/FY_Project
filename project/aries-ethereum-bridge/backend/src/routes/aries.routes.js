import express from 'express';
import { 
  getStatus, 
  getConnections, 
  createSchema, 
  createCredentialDefinition,
  issueCredential,
  getCredentials
} from '../controllers/aries.controller.js';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import ariesValidation from '../validation/aries.validation.js';

const router = express.Router();

/**
 * @swagger
 * /aries/status:
 *   get:
 *     summary: Get Aries agent status
 *     tags: [Aries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aries agent status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "active"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/status', authenticate, getStatus);

/**
 * @swagger
 * /aries/connections:
 *   get:
 *     summary: Get all Aries connections
 *     tags: [Aries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Aries connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   connection_id:
 *                     type: string
 *                   state:
 *                     type: string
 *                   their_label:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/connections', authenticate, getConnections);

/**
 * @swagger
 * /aries/schemas:
 *   post:
 *     summary: Create a new schema
 *     tags: [Aries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - version
 *               - attributes
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the schema
 *               version:
 *                 type: string
 *                 description: Version of the schema
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of attribute names
 *     responses:
 *       201:
 *         description: Schema created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/schemas', authenticate, validate(ariesValidation.createSchema), createSchema);

/**
 * @swagger
 * /aries/credential-definitions:
 *   post:
 *     summary: Create a new credential definition
 *     tags: [Aries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schemaId
 *             properties:
 *               schemaId:
 *                 type: string
 *                 description: ID of the schema to create definition for
 *               tag:
 *                 type: string
 *                 description: Optional tag for the credential definition
 *     responses:
 *       201:
 *         description: Credential definition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/credential-definitions', authenticate, validate(ariesValidation.createCredentialDefinition), createCredentialDefinition);

// Credential routes
router.post('/credentials/issue', 
  authenticate, 
  validate(ariesValidation.issueCredential),
  issueCredential
);
router.get('/credentials', 
  authenticate, 
  validate(ariesValidation.getCredentials),
  getCredentials
);

export default router;