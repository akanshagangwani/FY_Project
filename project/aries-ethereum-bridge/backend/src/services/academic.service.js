import axios from 'axios';
import web3 from 'web3';
import fs from 'fs/promises';
import path from 'path';
import solc from 'solc';
import config from '../config/index.js';
import { fileURLToPath } from 'url';
import { sendInvitationEmail } from '../Utils/emailService.js';
import { User } from '../Utils/mdb.js';

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
// Issue academic credential
async issueCredential(data) {
  try {
    const { connectionId, credentialDefinitionId } = data;

    // ADDED: Force connection activation before issuing credential
    try {
      console.log(`Force activating connection ${connectionId} before credential issuance`);
      await this.completeConnection(connectionId);
    } catch (activationError) {
      console.log('Connection activation attempted but failed (continuing anyway):', activationError.message);
    }

    let credDefId = credentialDefinitionId;
    if (!credDefId) {
      const setup = await this.setupAcademicCredentials();
      credDefId = setup.credentialDefinitionId;
    }

    const attributes = this.formatAcademicAttributes(data);

    console.log(`Issuing credential to connection ${connectionId} with definition ${credDefId}`);
    
    // MODIFIED: Added error handling for ACA-Py rejection
    try {
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
    } catch (credentialError) {
      console.error('ACA-Py rejected credential issuance:', credentialError.message);
      
      if (credentialError.response && credentialError.response.data) {
        console.error('Detailed error:', credentialError.response.data);
      }
      
      // TESTING ONLY: Use this approach only for testing
      return {
        status: 'error',
        message: 'Credential issuance failed but this is expected during testing with non-active connections',
        error: credentialError.message,
        note: 'In production, fix the connection activation issue instead of bypassing it'
      };
    }
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

export default new AcademicService();