import ariesService from '../services/aries.service.js';

export const getStatus = async (req, res, next) => {
  try {
    console.log('Received request for agent status');
    const status = await ariesService.getStatus();
    console.log('Status retrieved successfully:', status);
    res.status(200).json(status);
  } catch (error) {
    console.error('Controller error in getStatus:', error.message);
    // Send a more informative error response
    res.status(503).json({
      error: 'Service unavailable',
      message: `Cannot connect to Aries agent: ${error.message}`,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get connections
export const getConnections = async (req, res, next) => {
  try {
    const connections = await ariesService.getConnections();
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

// Create schema
export const createSchema = async (req, res, next) => {
  try {
    const { name, version, attributes } = req.body;
    
    if (!name || !version || !attributes || !Array.isArray(attributes)) {
      return res.status(400).json({ message: 'Invalid schema data' });
    }
    
    const schema = await ariesService.createSchema(name, version, attributes);
    res.status(201).json(schema);
  } catch (error) {
    next(error);
  }
};

// Create credential definition
export const createCredentialDefinition = async (req, res, next) => {
  try {
    const { schemaId, tag } = req.body;
    
    if (!schemaId) {
      return res.status(400).json({ message: 'Schema ID is required' });
    }
    
    const credentialDefinition = await ariesService.createCredentialDefinition(schemaId, tag);
    res.status(201).json(credentialDefinition);
  } catch (error) {
    next(error);
  }
};

// Issue credential
export const issueCredential = async (req, res, next) => {
  try {
    const { credentialDefinitionId, attributes, connectionId } = req.body;
    
    if (!credentialDefinitionId || !attributes || !connectionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const credential = await ariesService.issueCredential(credentialDefinitionId, attributes, connectionId);
    res.status(201).json(credential);
=======
    const result = await ariesService.issueCredential(credentialDefinitionId, attributes, connectionId);
    res.status(201).json(result);
>>>>>>> Stashed changes
=======
    const result = await ariesService.issueCredential(credentialDefinitionId, attributes, connectionId);
    res.status(201).json(result);
>>>>>>> Stashed changes
  } catch (error) {
    next(error);
  }
};

// Get credentials
export const getCredentials = async (req, res, next) => {
  try {
    const credentials = await ariesService.getCredentials();
    res.status(200).json(credentials);
  } catch (error) {
    next(error);
  }
};