import academicService from '../services/academic.service.js';

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