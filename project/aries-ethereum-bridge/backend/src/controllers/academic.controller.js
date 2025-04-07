import academicService from '../services/academic.service.js';
import { saveSkeletonSchema } from '../services/academic.service.js';
import { addAttributes } from '../services/academic.service.js';
import { getSchemaByUsernameAndLabel } from '../services/academic.service.js';

export const createSchema = async (req, res) => {
  try {
    const schema = await academicService.setupAcademicCredentials();
    res.status(201).json(schema);
  } catch (error) {
    console.error('Error creating schema:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const issueCredential = async (req, res) => {
  try {
    const result = await academicService.issueCredential(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error issuing credential:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const verifyCredential = async (req, res) => {
  try {
    const { credentialId } = req.params;
    const result = await academicService.verifyCredential(credentialId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error verifying credential:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const checkHealth = async (req, res) => {
  try {
    const healthStatus = await academicService.checkAriesHealth();
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Error checking health:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deployContract = async (req, res) => {
  try {
    const result = await academicService.deploySmartContract();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error deploying smart contract:', error.message);
    res.status(500).json({ error: error.message });
  }
};



export const getConnections = async (req, res) => {
  try {
    const result = await academicService.getConnections();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting connections:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const sendInvitationToUser = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.userId;
    const result = await academicService.sendConnectionInvitation(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending invitation:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const acceptUserInvitation = async (req, res) => {
  try {
    const { invitationCode } = req.body;
    const userId = req.user.userId;
    
    if (!invitationCode) {
      return res.status(400).json({ error: 'Invitation code is required' });
    }
    
    const result = await academicService.acceptInvitation(invitationCode, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error accepting invitation:', error.message);
    res.status(500).json({ error: error.message });
  }
};



export const getConnectionStatus = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const result = await academicService.checkConnectionStatus(connectionId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting connection status:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export async function saveCredentialController(req, res) {
  try {
    // Call the service function
    const savedCredential = await saveSkeletonSchema(req.body);
    res.status(201).json({ message: 'Credential saved successfully', credential: savedCredential });
  } catch (error) {
    console.error('Error saving credential:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function addAttributesController(req, res) {
  try {
    // Call the service function
    await addAttributes(req, res);
  } catch (error) {
    console.error('Error adding attributes:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Controller to fetch a schema by username and label.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function getSchemaByUsernameAndLabelController(req, res) {
  try {
    const { username, label } = req.query;
    await getSchemaByUsernameAndLabel(username, label, res);
    // If the schema is found, it will be sent in the response from the service function.
  } catch (error) {
    console.error('Error in getSchemaByUsernameAndLabelController:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}