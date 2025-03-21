import express from 'express';
import { issueAcademicCredential, verifyAcademicCredential } from '../controllers/academic.controller.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Issue academic credential
router.post('/issue', authenticate, issueAcademicCredential);

// Verify academic credential
router.get('/verify/:credentialId', authenticate, verifyAcademicCredential);

export default router;