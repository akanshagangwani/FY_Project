import axios from 'axios';
import web3 from 'web3';
import fs from 'fs/promises';
import path from 'path';
import solc from 'solc';
import config from '../config/index.js';
import { fileURLToPath } from 'url';
import { sendInvitationEmail } from '../Utils/emailService.js';
import { User } from '../Utils/mdb.js';
import StudentCredential from '../models/credSchema.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AcademicService {


  constructor() {
    this.schemaName = 'academic_credentials';
    this.schemaVersion = '1.0';
    this.attributes = [
      'student_name',
      'student_id',
      'degree',
      'graduation_date',
      'institution',
      'courses',
      'gpa',
    ];

    // Aries API client
    this.ariesClient = axios.create({
      baseURL: config.ARIES_ADMIN_URL,
      timeout: 30000,
      headers: { 'X-API-Key': config.ARIES_ADMIN_API_KEY },
    });

    this.web3 = new web3(config.ETH_RPC_URL || 'http://ganache:8545');
    this.contractInstance = null;
  }




// Deploy the smart contract
async deploySmartContract() {
  try {
    const accounts = await this.web3.eth.getAccounts();
    const contractPath = path.join(__dirname, '../smartcontracts/contracts/CredentialStore.sol');
    const source = await fs.readFile(contractPath, 'utf8');

    const input = {
      language: 'Solidity',
      sources: { 'CredentialStore.sol': { content: source } },
      settings: { outputSelection: { '*': { '*': ['*'] } } },
    };

    console.log('Compiling contract...');
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

    if (!compiledContract.contracts || !compiledContract.contracts['CredentialStore.sol']) {
      throw new Error('Contract compilation failed. Check your Solidity code.');
    }

    console.log('Contract compiled successfully.');
    const contractName = 'CredentialStore';
    const contract = compiledContract.contracts['CredentialStore.sol'][contractName];
    const { object: bytecode } = contract.evm.bytecode;
    const { abi } = contract;

    const abiPath = path.join(__dirname, '../smartcontracts/contract-abi.json');
    await fs.writeFile(abiPath, JSON.stringify(abi, null, 2));
    console.log('Contract ABI saved to contract-abi.json');

    console.log('Deploying contract...');
    const Contract = new this.web3.eth.Contract(abi);
    const deployTx = Contract.deploy({ data: `0x${bytecode}` });
    const gas = await deployTx.estimateGas();
    const deployedContract = await deployTx.send({ from: accounts[0], gas });

    console.log(`Contract deployed at address: ${deployedContract.options.address}`);

    const addressPath = path.join(__dirname, '../smartcontracts/contract-address.txt');
    await fs.writeFile(addressPath, deployedContract.options.address);
    console.log('Contract address saved to contract-address.txt');

    this.contractInstance = deployedContract;
    return { address: deployedContract.options.address, abi };
  } catch (error) {
    console.error('Error deploying smart contract:', error.message);
    throw error;
  }
}




  // Initialize the smart contract
  async initializeContract() {
    try {
      const abiPath = path.join(__dirname, '../smartcontracts/contract-abi.json');
      const addressPath = path.join(__dirname, '../smartcontracts/contract-address.txt');
      const abi = JSON.parse(await fs.readFile(abiPath, 'utf8'));
      const address = await fs.readFile(addressPath, 'utf8');
      this.contractInstance = new this.web3.eth.Contract(abi, address.trim());
      console.log(`Contract initialized at address: ${address.trim()}`);
    } catch (error) {
      console.error('Error initializing contract:', error.message);
      throw error;
    }
  }





// Create a connection invitation and send it via email
// Create a connection invitation and send it via email
async sendConnectionInvitation(userId, Email) {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    
    const response = await this.ariesClient.post('/connections/create-invitation', {
      alias: Email,
      auto_accept: true,
      multi_use: false
    });
    
    const invitation = response.data.invitation;
    const invitationBase64 = Buffer.from(JSON.stringify(invitation)).toString('base64');

    // Store a single connectionId for this relationship
    user.connectionId = response.data.connection_id;
    user.connectionState = 'invitation-sent';
    await user.save();
    
    await sendInvitationEmail(Email, invitationBase64);
    
    return { 
      message: 'Invitation sent successfully', 
      email: Email,
      connectionId: response.data.connection_id,
      invitationCode: invitationBase64
    };
  } catch (error) {
    console.error('Error sending connection invitation:', error.message);
    throw error;
  }
}





async acceptInvitation(invitationCode, issuerId) {
  try {
    const issuer = await User.findOne({ id: issuerId });
    if (!issuer) {
      throw new Error('Issuer not found');
    }
    
    const invitation = JSON.parse(Buffer.from(invitationCode, 'base64').toString('utf-8'));
    
    // This creates a new connection that simulates the holder accepting the invitation
    const response = await this.ariesClient.post('/connections/receive-invitation', invitation);
    
    // Store this as a separate record for testing purposes
    const acceptedConnectionId = response.data.connection_id;
    
    issuer.acceptedConnectionId = acceptedConnectionId;
    issuer.connectionState = 'request-sent';
    await issuer.save();
    
    return {
      message: 'Connection established',
      connectionId: acceptedConnectionId,
      state: response.data.state,
      originalInviterId: issuer.connectionId,
      note: "For credential issuance, use this returned connectionId"
    };
  } catch (error) {
    console.error('Error accepting invitation:', error.message);
    throw error;
  }
}



  // Check connection status
  async checkConnectionStatus(connectionId) {
    try {
      const response = await this.ariesClient.get(`/connections/${connectionId}`);
      let statusMessage = 'Connection is being established';
      let isReady = false;

      if (response.data.state === 'active') {
        statusMessage = 'Connection is active and ready for credential exchange';
        isReady = true;
      } else if (response.data.state === 'request') {
        statusMessage = 'Connection request sent, waiting for response';
      } else if (response.data.state === 'response') {
        statusMessage = 'Connection response received, almost complete';
      } else if (response.data.state === 'invitation') {
        statusMessage = 'Connection invitation sent, waiting for acceptance';
      }
      return {
        connectionId,
        state: response.data.state,
        theirLabel: response.data.their_label || null,
        createdAt: response.data.created_at,
        statusMessage,
        isReady,
        rfc23State: response.data.rfc23_state || null
      };
    } catch (error) {
      console.error('Error checking connection status:', error.message);
      throw error;
    }
  }




  async completeConnection(connectionId) {
    try {
      // First try to get the connection status
      const connectionResponse = await this.ariesClient.get(`/connections/${connectionId}`);
      
      console.log(`Connection state: ${connectionResponse.data.state}`);
      
      if (connectionResponse.data.state === 'invitation') {
        // Send request to move from invitation to request state
        await this.ariesClient.post(`/connections/${connectionId}/accept-invitation`);
        console.log('Invitation accepted, moving to request state...');
      }
      
      if (connectionResponse.data.state === 'request') {
        // Send request to move from request to response state
        console.log('Connection is in request state. Waiting for automatic processing...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    
      
      // Check final state
      const finalResponse = await this.ariesClient.get(`/connections/${connectionId}`);
      return {
        connectionId,
        state: finalResponse.data.state,
        isActive: finalResponse.data.state === 'active'
      };
    } catch (error) {
      console.error('Error completing connection:', error);
      throw error;
    }
  }



  // Health check for Aries agent
  async checkAriesHealth() {
    try {
      const response = await this.ariesClient.get('/status');
      return { status: 'ok', aries: response.data };
    } catch (error) {
      console.error('Error checking Aries health:', error.message);
      throw new Error('Failed to connect to Aries agent');
    }
  }




// Add this method to AcademicService
async getIssuedCredentials() {
  try {
    const response = await this.ariesClient.get('/issue-credential/records');
    return response.data;
  } catch (error) {
    console.error('Error getting credentials:', error.message);
    throw error;
  }
}





// Get all connections
async getConnections() {
  try {
    const response = await this.ariesClient.get('/connections');
    return response.data;
  } catch (error) {
    console.error('Error getting connections:', error.message);
    throw error;
  }
}



async setupAcademicCredentials() {
  try {
    // Generate a unique version using timestamp to avoid conflicts
    const uniqueVersion = `1.${Math.floor(Date.now() / 1000)}`;
    console.log(`Creating schema ${this.schemaName} with unique version ${uniqueVersion}`);
    
    // Create schema
    const schemaResponse = await this.ariesClient.post('/schemas', {
      schema_name: this.schemaName,
      schema_version: uniqueVersion,
      attributes: this.attributes,
    });
    
    this.schemaId = schemaResponse.data.schema_id;
    console.log(`Created schema with ID: ${this.schemaId}`);
    
    // Wait for schema to propagate on the ledger
    console.log('Waiting for schema to propagate on the ledger...');
    await this.waitForSchemaPropagation(this.schemaId);
    
    // Retry mechanism for credential definition creation
    console.log(`Creating credential definition for schema ${this.schemaId}`);
    this.credDefId = await this.retryCredentialDefinitionCreation(this.schemaId);
    
    console.log(`Created credential definition with ID: ${this.credDefId}`);
    return {
      schemaId: this.schemaId,
      credentialDefinitionId: this.credDefId,
    };
  } catch (error) {
    console.error('Error setting up academic credentials:', error.message);
    
    // If schema creation fails, try to find existing credential definitions
    console.log('Looking for existing credential definitions...');
    try {
      const searchResponse = await this.ariesClient.get('/credential-definitions/created');
      
      if (searchResponse.data && 
          searchResponse.data.credential_definition_ids && 
          searchResponse.data.credential_definition_ids.length > 0) {
        this.credDefId = searchResponse.data.credential_definition_ids[0];
        console.log(`Using existing credential definition: ${this.credDefId}`);
        
        return {
          message: 'Using existing credential definition',
          credentialDefinitionId: this.credDefId,
        };
      } else {
        throw new Error('No existing credential definitions found.');
      }
    } catch (fallbackError) {
      console.error('Error finding existing credential definitions:', fallbackError.message);
      throw new Error('Unable to create schema or find existing credential definitions');
    }
  }
}

// Helper method to wait for schema propagation
async waitForSchemaPropagation(schemaId, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Checking schema availability (attempt ${i + 1}/${retries})...`);
      const response = await this.ariesClient.get(`/schemas/${schemaId}`);
      if (response.data) {
        console.log('Schema is now available on the ledger.');
        return;
      }
    } catch (error) {
      console.log('Schema not yet available, retrying...');
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Schema ${schemaId} is not available on the ledger after ${retries} retries.`);
}

// Helper method to retry credential definition creation
async retryCredentialDefinitionCreation(schemaId, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to create credential definition (attempt ${i + 1}/${retries})...`);
      const credDefResponse = await this.ariesClient.post('/credential-definitions', {
        schema_id: schemaId,
        tag: 'default',
        support_revocation: false,
      });
      return credDefResponse.data.credential_definition_id;
    } catch (error) {
      console.log('Credential definition creation failed, retrying...');
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Unable to create credential definition for schema ${schemaId} after ${retries} retries.`);
}



  // Format academic attributes for credential issuance
  formatAcademicAttributes(data) {
    return [
      { name: 'student_name', value: data.studentName },
      { name: 'student_id', value: data.studentId },
      { name: 'degree', value: data.degree },
      { name: 'graduation_date', value: data.graduationDate || new Date().toISOString() },
      { name: 'institution', value: data.institution },
      { name: 'courses', value: JSON.stringify(data.courses || []) },
      { name: 'gpa', value: data.gpa ? data.gpa.toString() : '0.0' },
    ];
  }





// Modify the issueCredential method to take data directly from frontend
async issueCredential(credentialData) {
  try {
    const { connectionId, ...attributes } = credentialData;
    
    // Get credential definition (either existing or create new)
    let credDefId;
    try {
      // Try to use an existing credential definition
      const createdResponse = await this.ariesClient.get('/credential-definitions/created');
      if (createdResponse.data.credential_definition_ids && 
          createdResponse.data.credential_definition_ids.length > 0) {
        credDefId = createdResponse.data.credential_definition_ids[0];
        console.log(`Using existing credential definition: ${credDefId}`);
      } else {
        // No credential definition exists, create schema and credential definition
        const setup = await this.setupAcademicCredentials();
        credDefId = setup.credentialDefinitionId;
      }
    } catch (error) {
      console.log('Error checking existing credential definitions, creating new one');
      const setup = await this.setupAcademicCredentials();
      credDefId = setup.credentialDefinitionId;
    }
    
    // Format attributes from incoming data
    const formattedAttributes = this.formatCredentialAttributes(attributes);
    
    // Issue credential
    console.log(`Issuing credential to connection ${connectionId} with definition ${credDefId}`);
    const response = await this.ariesClient.post('/issue-credential/send-offer', {
      connection_id: connectionId,
      credential_proposal: { attributes: formattedAttributes },
      credential_definition_id: credDefId,
      auto_remove: false,
      trace: true,
    });
    
    // Store credential hash on blockchain
    const credentialHash = this.web3.utils.sha3(JSON.stringify(response.data));
    const accounts = await this.web3.eth.getAccounts();
    const transaction = await this.contractInstance.methods
      .storeCredential(response.data.credential_exchange_id, credentialHash)
      .send({ from: accounts[0], gas: 2000000 });
    
    // Store in MongoDB for application reference
    const credentialRecord = new StudentCredential({
      username: attributes.studentName || 'Unknown',
      label: attributes.degree || 'Credential',
      studentName: attributes.studentName,
      studentId: attributes.studentId,
      degree: attributes.degree,
      graduationDate: attributes.graduationDate,
      institution: attributes.institution,
      courses: attributes.courses || [],
      gpa: attributes.gpa,
      credentialId: response.data.credential_exchange_id,
      blockchainHash: credentialHash,
      additionalAttributes: {},
    });
    await credentialRecord.save();
    
    return {
      credentialExchangeId: response.data.credential_exchange_id,
      state: response.data.state,
      blockchain: {
        transactionHash: transaction.transactionHash,
        credentialHash: credentialHash
      }
    };
  } catch (error) {
    console.error('Error issuing credential:', error);
    throw error;
  }
}

// New helper method to format any incoming attributes
formatCredentialAttributes(attributes) {
  const formattedAttributes = [];
  
  // Convert standard academic attributes
  if (attributes.studentName) formattedAttributes.push({ name: 'student_name', value: attributes.studentName });
  if (attributes.studentId) formattedAttributes.push({ name: 'student_id', value: attributes.studentId });
  if (attributes.degree) formattedAttributes.push({ name: 'degree', value: attributes.degree });
  if (attributes.graduationDate) formattedAttributes.push({ name: 'graduation_date', value: attributes.graduationDate });
  if (attributes.institution) formattedAttributes.push({ name: 'institution', value: attributes.institution });
  if (attributes.courses) formattedAttributes.push({ name: 'courses', value: JSON.stringify(attributes.courses || []) });
  if (attributes.gpa) formattedAttributes.push({ name: 'gpa', value: attributes.gpa.toString() });
  
  // Add any additional attributes that might be in the data
  Object.entries(attributes).forEach(([key, value]) => {
    if (!['studentName', 'studentId', 'degree', 'graduationDate', 'institution', 'courses', 'gpa', 'connectionId'].includes(key)) {
      formattedAttributes.push({ name: key, value: typeof value === 'object' ? JSON.stringify(value) : String(value) });
    }
  });
  
  return formattedAttributes;
}


  // Verify academic credential
  async verifyCredential(credentialId) {
    try {
      // Fetch credential from Aries
      const credentialResponse = await this.ariesClient.get(`/issue-credential/records/${credentialId}`);
      const credential = credentialResponse.data;

      // Fetch stored hash from blockchain
      const storedHash = await this.contractInstance.methods.getCredential(credentialId).call();

      // Calculate hash of the fetched credential
      const calculatedHash = this.web3.utils.sha3(JSON.stringify(credential));
      const verified = storedHash === calculatedHash;

      return { verified, storedHash, calculatedHash, credential };
    } catch (error) {
      console.error('Error verifying academic credential:', error.message);
      throw error;
    }
  }
}

/**
 * Generate and save a skeleton schema.
 * @param {Object} data - The skeleton schema data.
 * @returns {Object} - The saved skeleton schema document.
 */
export async function saveSkeletonSchema(data) {
  try {
    const skeletonSchema = new StudentCredential({
      username: data.username, // Admin or user creating the schema
      label: data.label,       // Unique label for the schema
      studentName: null,       // Skeleton fields are set to null or empty
      studentId: null,
      degree: null,
      graduationDate: null,
      institution: null,
      courses: [],
      gpa: null,
      credentialId: null,
      blockchainHash: null,
      additionalAttributes: {}, // Empty additional attributes
    });

    const savedSkeleton = await skeletonSchema.save();
    console.log('Skeleton schema saved to database successfully.');
    return savedSkeleton;
  } catch (error) {
    console.error('Error saving skeleton schema to database:', error.message);
    throw error;
  }
}

/**
 * Add attributes to an existing credential or skeleton schema.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function addAttributes(req, res) {
  try {
    const { username, label, additionalAttributes } = req.body;

    // Validate input
    if (!username || !label) {
      return res.status(400).json({ message: 'Username and label are required' });
    }

    // Find the credential by username and label
    const credential = await StudentCredential.findOne({ username, label });
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found for the given username and label' });
    }

    // Convert additionalAttributes to a Map if it's a plain object
    if (additionalAttributes && typeof additionalAttributes === 'object' && !additionalAttributes instanceof Map) {
      credential.additionalAttributes = new Map(Object.entries(additionalAttributes));
    } else {
      credential.additionalAttributes = additionalAttributes;
    }

    // Save the updated credential
    const updatedCredential = await credential.save();
    res.status(200).json({ message: 'Attributes added successfully', credential: updatedCredential });
  } catch (error) {
    console.error('Error adding attributes:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Fetch a schema by username and label.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function getSchemaByUsernameAndLabel(username, label, res) {
  try {
    const schema = await StudentCredential.findOne({ username, label });
    if (!schema) {
      return res.status(404).json({ message: 'Schema not found for the given username and label' });
    }

    // Return the schema
    res.status(200).json({ message: 'Schema fetched successfully', schema });
  } catch (error) {
    console.error('Error fetching schema:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * List all schema labels under a specific username.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function listSchemasByUsername(username, res) {
  try {
    // Find all schemas associated with the username and project only the label field
    const schemas = await StudentCredential.find({ username }, 'label');
    if (!schemas || schemas.length === 0) {
      return res.status(404).json({ message: 'No schemas found for the given username' });
    }

    // Extract labels from the schemas
    const labels = schemas.map((schema) => schema.label);

    // Return the list of labels
    res.status(200).json({ message: 'Labels fetched successfully', labels });
  } catch (error) {
    console.error('Error listing schema labels:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default new AcademicService();