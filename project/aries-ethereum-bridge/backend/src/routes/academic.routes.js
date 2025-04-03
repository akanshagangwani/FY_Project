import express from 'express';
import { issueAcademicCredential, verifyAcademicCredential } from '../controllers/academic.controller.js';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import academicValidation from '../validation/academic.validation.js';

const router = express.Router();

/**
 * @swagger
 * /academic/issue:
 *   post:
 *     summary: Issue an academic credential
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
 *               - connectionId
 *               - studentName
 *               - studentId
 *               - degree
 *               - institution
 *             properties:
 *               connectionId:
 *                 type: string
 *                 description: Connection ID for the credential recipient
 *               studentName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Full name of the student
 *               studentId:
 *                 type: string
 *                 description: Unique student identifier
 *               degree:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Degree earned
 *               graduationDate:
 *                 type: string
 *                 format: date
 *                 description: Date of graduation
 *               institution:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 description: Name of the educational institution
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of completed courses
 *               gpa:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 4
 *                 description: Grade Point Average
 *     responses:
 *       201:
 *         description: Credential issued successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/issue', 
  authenticate, 
  validate(academicValidation.issueAcademicCredential),
  issueAcademicCredential
);

/**
 * @swagger
 * /academic/verify/{credentialId}:
 *   get:
 *     summary: Verify an academic credential
 *     tags: [Academic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: credentialId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the credential to verify
 *     responses:
 *       200:
 *         description: Credential verification result
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Credential not found
 *       500:
 *         description: Server error
 */
router.get('/verify/:credentialId', 
  authenticate, 
  validate(academicValidation.verifyAcademicCredential),
  verifyAcademicCredential
);

export default router;