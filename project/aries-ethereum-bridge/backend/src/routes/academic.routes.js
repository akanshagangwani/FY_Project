import express from 'express';
import { 
  createAcademicSchema,
  createAcademicCredentialDefinition,
  issueAcademicCredential,
  verifyAcademicCredential,
  getAcademicCredentialDetails
} from '../controllers/academic.controller.js';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import { 
  createSchema,
  createCredentialDefinition,
  issueCredential,
  verifyCredential,
  getCredentialDetails
} from '../validation/academic.validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicCredential:
 *       type: object
 *       required:
 *         - studentName
 *         - studentId
 *         - degree
 *         - graduationDate
 *         - institution
 *         - gpa
 *       properties:
 *         studentName:
 *           type: string
 *         studentId:
 *           type: string
 *         degree:
 *           type: string
 *         graduationDate:
 *           type: string
 *         institution:
 *           type: string
 *         courses:
 *           type: array
 *           items:
 *             type: string
 *         gpa:
 *           type: string
 *     CredentialDefinition:
 *       type: object
 *       required:
 *         - schemaId
 *       properties:
 *         schemaId:
 *           type: string
 *     IssueCredential:
 *       type: object
 *       required:
 *         - credentialDefinitionId
 *         - connectionId
 *         - studentName
 *         - studentId
 *         - degree
 *         - graduationDate
 *         - institution
 *         - gpa
 *       properties:
 *         credentialDefinitionId:
 *           type: string
 *         connectionId:
 *           type: string
 *         studentName:
 *           type: string
 *         studentId:
 *           type: string
 *         degree:
 *           type: string
 *         graduationDate:
 *           type: string
 *         institution:
 *           type: string
 *         courses:
 *           type: array
 *           items:
 *             type: string
 *         gpa:
 *           type: string
 *     VerificationResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         verified:
 *           type: boolean
 *         credential:
 *           $ref: '#/components/schemas/AcademicCredential'
 *         blockchainStatus:
 *           type: object
 */

/**
 * @swagger
 * /academic/schema:
 *   post:
 *     summary: Create academic credential schema
 *     tags: [Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Academic schema created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schemaId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/schema', authenticate, validate(createSchema), createAcademicSchema);

/**
 * @swagger
 * /academic/credential-definition:
 *   post:
 *     summary: Create academic credential definition
 *     tags: [Academic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CredentialDefinition'
 *     responses:
 *       201:
 *         description: Academic credential definition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credentialDefinitionId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/credential-definition',
  authenticate,
  validate(createCredentialDefinition),
  createAcademicCredentialDefinition
);

/**
 * @swagger
 * /academic/issue:
 *   post:
 *     summary: Issue academic credential
 *     tags: [Academic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueCredential'
 *     responses:
 *       201:
 *         description: Academic credential issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 credentialId:
 *                   type: string
 *                 blockchain:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/issue',
  authenticate,
  validate(issueCredential),
  issueAcademicCredential
);

/**
 * @swagger
 * /academic/verify/{credentialId}:
 *   get:
 *     summary: Verify academic credential
 *     tags: [Academic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: credentialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Academic credential verification result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationResult'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/verify/:credentialId',
  authenticate,
  validate(verifyCredential),
  verifyAcademicCredential
);

/**
 * @swagger
 * /academic/details/{credentialId}:
 *   get:
 *     summary: Get academic credential details
 *     tags: [Academic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: credentialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Academic credential details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AcademicCredential'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/details/:credentialId',
  authenticate,
  validate(getCredentialDetails),
  getAcademicCredentialDetails
);

export default router;