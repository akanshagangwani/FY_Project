import express from 'express';
import { 
<<<<<<< Updated upstream
  createAcademicSchema,
  createAcademicCredentialDefinition,
  issueAcademicCredential,
  verifyAcademicCredential
=======
  issueAcademicCredential, 
  verifyAcademicCredential,
  getAcademicCredentialDetails 
>>>>>>> Stashed changes
} from '../controllers/academic.controller.js';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import * as academicValidation from '../validation/academic.validation.js';

const router = express.Router();

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
 *       401:
 *         description: Unauthorized
 */
router.post('/schema', authenticate, validate(academicValidation.createSchema), createAcademicSchema);

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
 *             type: object
 *             required:
 *               - schemaId
 *             properties:
 *               schemaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Academic credential definition created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/credential-definition',
  authenticate,
  validate(academicValidation.createCredentialDefinition),
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
 *             type: object
 *             required:
 *               - credentialDefinitionId
 *               - studentData
 *               - connectionId
 *             properties:
 *               credentialDefinitionId:
 *                 type: string
 *               studentData:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   degree:
 *                     type: string
 *                   institution:
 *                     type: string
 *                   year:
 *                     type: string
 *                   gpa:
 *                     type: string
 *                   major:
 *                     type: string
 *               connectionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Academic credential issued successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/issue',
  authenticate,
  validate(academicValidation.issueCredential),
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
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/verify/:credentialId',
  authenticate,
  validate(academicValidation.verifyCredential),
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
 *         description: ID of the credential to get details for
 *     responses:
 *       200:
 *         description: Credential details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     student_name:
 *                       type: string
 *                     student_id:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     graduation_date:
 *                       type: string
 *                     institution:
 *                       type: string
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: string
 *                     gpa:
 *                       type: string
 *                     verified:
 *                       type: boolean
 *                     blockchainStatus:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Credential not found
 *       500:
 *         description: Server error
 */
router.get('/details/:credentialId', 
  authenticate, 
  validate(academicValidation.verifyAcademicCredential),
  getAcademicCredentialDetails
);

export default router;