import express from 'express';
import ariesService from '../services/aries.service.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Issue credential
router.post('/issue', authenticate, async (req, res, next) => {
  try {
    const { credentialDefinitionId, attributes, connectionId } = req.body;
    
    if (!credentialDefinitionId || !attributes || !connectionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    const credential = await ariesService.issueCredential(
      credentialDefinitionId, 
      attributes, 
      connectionId
    );
    
    res.status(201).json(credential);
  } catch (error) {
    next(error);
  }
});

// Get credential records
router.get('/', authenticate, async (req, res, next) => {
  try {
    const response = await ariesService.apiClient.get('/issue-credential/records');
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;