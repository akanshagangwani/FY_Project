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
    const { credentialDefinitionId, studentData, connectionId } = req.body;
    
    if (!credentialDefinitionId || !studentData || !connectionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const credential = await academicService.issueAcademicCredential(
      credentialDefinitionId,
      studentData,
      connectionId
    );
    
    res.status(201).json(credential);
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
    
    const verification = await academicService.verifyAcademicCredential(credentialId);
    res.status(200).json(verification);
  } catch (error) {
    next(error);
  }
};