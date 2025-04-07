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
async sendConnectionInvitation(userId) {
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    
    const response = await this.ariesClient.post('/connections/create-invitation', {
      alias: user.email,
      auto_accept: true,
      multi_use: false
    });
    
    const invitation = response.data.invitation;
    const invitationBase64 = Buffer.from(JSON.stringify(invitation)).toString('base64');
    user.connectionId = response.data.connection_id;
    user.connectionState = 'pending';
    await user.save();
    
    await sendInvitationEmail(user.email, invitationBase64);
    
    return { 
      message: 'Invitation sent successfully', 
      email: user.email,
      connectionId: response.data.connection_id,
      invitationCode: invitationBase64  // Return the code for testing
    };
  } catch (error) {
    console.error('Error sending connection invitation:', error.message);
    throw error;
  }
}





async acceptInvitation(invitationCode, userId) {
  try {
    // Find user
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    
    const invitation = JSON.parse(Buffer.from(invitationCode, 'base64').toString('utf-8'));
    const response = await this.ariesClient.post('/connections/receive-invitation', invitation);
    
    // Store the new connection ID
    user.connectionId = response.data.connection_id;
    user.connectionState = 'request-sent';
    await user.save();
    
    return {
      message: 'Invitation accepted successfully',
      connectionId: response.data.connection_id,
      state: response.data.state
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
      return {
        connectionId,
        state: response.data.state,
        theirLabel: response.data.their_label,
        createdAt: response.data.created_at
      };
    } catch (error) {
      console.error('Error checking connection status:', error.message);
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



  // Create academic schema and credential definition
  async setupAcademicCredentials() {
    try {
      const schemaResponse = await this.ariesClient.post('/schemas', {
        schema_name: this.schemaName,
        schema_version: this.schemaVersion,
        attributes: this.attributes,
      });

      const credDefResponse = await this.ariesClient.post('/credential-definitions', {
        schema_id: schemaResponse.data.schema_id,
      });

      return {
        schemaId: schemaResponse.data.schema_id,
        credentialDefinitionId: credDefResponse.data.credential_definition_id,
      };
    } catch (error) {
      console.error('Error setting up academic credentials:', error.message);
      throw error;
    }
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




  // Issue academic credential
  async issueCredential(data) {
    try {
      const { connectionId, credentialDefinitionId } = data;

      let credDefId = credentialDefinitionId;
      if (!credDefId) {
        const setup = await this.setupAcademicCredentials();
        credDefId = setup.credentialDefinitionId;
      }

      const attributes = this.formatAcademicAttributes(data);

      const response = await this.ariesClient.post('/issue-credential/send-offer', {
        connection_id: connectionId,
        credential_proposal: { attributes },
        credential_definition_id: credDefId,
        auto_remove: false,
        trace: true,
      });

      // Hash and store credential on blockchain
      const credentialHash = this.web3.utils.sha3(JSON.stringify(response.data));
      const accounts = await this.web3.eth.getAccounts();
      await this.contractInstance.methods
        .storeCredential(response.data.credential_exchange_id, credentialHash)
        .send({ from: accounts[0], gas: 2000000 });

      return {
        credentialId: response.data.credential_exchange_id,
        blockchain: { credentialHash },
      };
    } catch (error) {
      console.error('Error issuing academic credential:', error.message);
      throw error;
    }
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

export default new AcademicService();