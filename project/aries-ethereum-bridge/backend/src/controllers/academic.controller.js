import academicService from '../services/academic.service.js';
import { saveSkeletonSchema } from '../services/academic.service.js';
import { addAttributes } from '../services/academic.service.js';
import { getSchemaByUsernameAndLabel } from '../services/academic.service.js';
import { listSchemasByUsername } from '../services/academic.service.js';

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
    const connections = await academicService.getConnections();
    
    const result = {
      connections,
      hint: "For issuing credentials, use a connection with state 'active'. If no active connections exist, you need to send an invitation and have it accepted first."
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting connections:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const sendInvitationToUser = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const userId = req.user.userId;
    const result = await academicService.sendConnectionInvitation(userId,Email);
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



export const getIssuedCredentials = async (req, res) => {
  try {
    const credentials = await academicService.getIssuedCredentials();
    res.status(200).json(credentials);
  } catch (error) {
    console.error('Error fetching credentials:', error.message);
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

/**
 * Controller to list all schemas under a specific username.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function listSchemasByUsernameController(req, res) {
  try {
    const { username } = req.query;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    await listSchemasByUsername(username, res);
  } catch (error) {
    console.error('Error in listSchemasByUsernameController:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const completeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const result = await academicService.completeConnection(connectionId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error completing connection:', error);
    res.status(500).json({ error: error.message });
  }
};
