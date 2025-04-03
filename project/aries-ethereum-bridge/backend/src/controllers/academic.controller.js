import academicService from '../services/academic.service.js';

// Create academic schema
export const createAcademicSchema = async (req, res, next) => {
  try {
    const schema = await academicService.createAcademicSchema();
    res.status(201).json(schema);
  } catch (error) {
    next(error);
  }
};

// Create academic credential definition
export const createAcademicCredentialDefinition = async (req, res, next) => {
  try {
    const { schemaId } = req.body;
    
    if (!schemaId) {
      return res.status(400).json({ message: 'Schema ID is required' });
    }
    
    const credentialDefinition = await academicService.createAcademicCredentialDefinition(schemaId);
    res.status(201).json(credentialDefinition);
  } catch (error) {
    next(error);
  }
};

// Issue academic credential
export const issueAcademicCredential = async (req, res, next) => {
  try {
    const { 
      connectionId, 
      studentName, 
      studentId, 
      degree, 
      graduationDate, 
      institution,
      courses = [],
      gpa,
      credentialDefinitionId
    } = req.body;
    
    if (!credentialDefinitionId || !connectionId || !studentName || !studentId || !degree || !graduationDate || !institution || !gpa) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Issue credential using academic service
    const result = await academicService.issueCredential({
      connectionId,
      studentName,
      studentId,
      degree,
      graduationDate,
      institution,
      courses,
      gpa,
      credentialDefinitionId
    });
    
    res.status(201).json({
      success: true,
      message: 'Academic credential issued successfully',
      credentialId: result.credentialId,
      blockchain: result.blockchain
    });
  } catch (error) {
    next(error);
  }
};

// Verify academic credential
export const verifyAcademicCredential = async (req, res, next) => {
  try {
    const { credentialId } = req.params;
    
    if (!credentialId) {
      return res.status(400).json({ message: 'Credential ID is required' });
    }
    
    // Verify credential using academic service
    const result = await academicService.verifyCredential(credentialId);
    
    res.json({
      success: true,
      verified: result.verified,
      credential: result.credential,
      blockchainStatus: result.blockchainStatus
    });
  } catch (error) {
    next(error);
  }
};

// Get academic credential details
export const getAcademicCredentialDetails = async (req, res, next) => {
  try {
    const { credentialId } = req.params;
    
    if (!credentialId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credential ID is required' 
      });
    }
    
    // Get credential details using academic service
    const result = await academicService.getCredentialDetails(credentialId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};