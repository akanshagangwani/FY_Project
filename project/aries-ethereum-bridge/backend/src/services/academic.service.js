import axios from 'axios';
import web3 from 'web3';
import fs from 'fs/promises';
import path from 'path';
import solc from 'solc';
import config from '../config/index.js';
import { fileURLToPath } from 'url';

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

    // Save ABI to file in the smartcontracts directory
    const abiPath = path.join(__dirname, '../smartcontracts/contract-abi.json');
    await fs.writeFile(abiPath, JSON.stringify(abi, null, 2));
    console.log('Contract ABI saved to contract-abi.json');

    console.log('Deploying contract...');
    const Contract = new this.web3.eth.Contract(abi);
    const deployTx = Contract.deploy({ data: `0x${bytecode}` });
    const gas = await deployTx.estimateGas();
    const deployedContract = await deployTx.send({ from: accounts[0], gas });

    console.log(`Contract deployed at address: ${deployedContract.options.address}`);

    // Save contract address to a file in the smartcontracts directory
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

      // Get or create credential definition
      let credDefId = credentialDefinitionId;
      if (!credDefId) {
        const setup = await this.setupAcademicCredentials();
        credDefId = setup.credentialDefinitionId;
      }

      // Format attributes
      const attributes = this.formatAcademicAttributes(data);

      // Issue credential
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

export default new AcademicService();