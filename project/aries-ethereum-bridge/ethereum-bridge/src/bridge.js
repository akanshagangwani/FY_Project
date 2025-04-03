import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Web3 from 'web3';
import solc from 'solc';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());

// Initialize Web3
const web3 = new Web3(process.env.ETH_RPC_URL || 'http://localhost:8545');
// const CONTRACT_ADDRESS = '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0'; 
const CONTRACT_ABI = JSON.parse(await fs.readFile(path.join(__dirname, 'contract-abi.json'), 'utf8'));
let contractInstance = null;

// Contract deployment middleware
const deployContract = async (req, res, next) => {
  try {
    // Check if contract is already deployed
    try {
      const address = await fs.readFile(path.join(__dirname, 'contract-address.txt'), 'utf8');
      const abi = JSON.parse(await fs.readFile(path.join(__dirname, 'contract-abi.json'), 'utf8'));
      
      contractInstance = new web3.eth.Contract(abi, address.trim());
      console.log('Contract already deployed at:', address);
      
      // Only proceed to next middleware if not explicitly requesting deployment
      if (!req.query.deploy) {
        return next();
      }
    } catch (e) {
      // Contract not deployed yet, continue with deployment
      console.log('Contract not found, deploying...');
    }

    // Get accounts
    const accounts = await web3.eth.getAccounts();
    console.log(`Deploying from account: ${accounts[0]}`);
    
    // Read contract source
    const source = await fs.readFile(path.join(__dirname, 'contracts/CredentialStore.sol'), 'utf8');
    
    // Compile contract
    const input = {
      language: 'Solidity',
      sources: {
        'CredentialStore.sol': { content: source }
      },
      settings: {
        outputSelection: {
          '*': { '*': ['*'] }
        }
      }
    };
    
    console.log('Compiling contract...');
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Extract ABI and bytecode
    const contractName = 'CredentialStore';
    const contract = compiledContract.contracts['CredentialStore.sol'][contractName];
    const { object: bytecode } = contract.evm.bytecode;
    const { abi } = contract;
    
    // Save ABI to file for later use
    await fs.writeFile(path.join(__dirname, 'contract-abi.json'), JSON.stringify(abi, null, 2));
    
    // Deploy contract
    console.log('Deploying contract...');
    const Contract = new web3.eth.Contract(abi);
    const deployTx = Contract.deploy({
      data: `0x${bytecode}`
    });
    
    const gasLimit = 20000000; // Set a high gas limit
    const deployedContract = await deployTx.send({
      from: accounts[0],
      gas: gasLimit
    });
    
    console.log(`Contract deployed at address: ${deployedContract.options.address}`);
    
    // Save address to file
    await fs.writeFile(path.join(__dirname, 'contract-address.txt'), deployedContract.options.address);
    
    // Set contract instance for use in routes
    contractInstance = deployedContract;
    
    if (req.query.deploy) {
      res.json({
        success: true,
        message: 'Contract deployed successfully',
        address: deployedContract.options.address
      });
    } else {
      next();
    }
    
  } catch (error) {
    console.error('Error in deploy middleware:', error);
    if (req.query.deploy) {
      res.status(500).json({ 
        success: false, 
        message: 'Contract deployment failed', 
        error: error.message 
      });
    } else {
      next(error);
    }
  }
};

// Bridge middleware for handling credential verification and storage
const bridgeMiddleware = async (req, res, next) => {
  if (!contractInstance) {
    return res.status(500).json({ error: 'Contract not initialized' });
  }
  
  req.contractInstance = contractInstance;
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Force contract deployment endpoint
app.post('/api/deploy', async (req, res) => {
  try {
    // Create a modified request object with the deploy flag set
    const modifiedReq = { 
      ...req, 
      query: { 
        ...req.query, 
        deploy: true 
      } 
    };
    
    // Call the middleware with our modified request
    await deployContract(modifiedReq, res, () => {
      // This should not be called due to the deploy flag
      res.status(500).json({ 
        success: false, 
        message: 'Unexpected middleware flow' 
      });
    });
  } catch (error) {
    console.error('Error in deploy endpoint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Contract deployment failed', 
      error: error.message 
    });
  }
});

// Store credential endpoint
app.post('/api/credentials', deployContract, bridgeMiddleware, async (req, res) => {
  try {
    const { credentialId, credentialData } = req.body;
    
    // Input validation
    if (!credentialId || typeof credentialId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing credentialId' });
    }
    if (!credentialData || typeof credentialData !== 'object') {
      return res.status(400).json({ error: 'Invalid or missing credentialData' });
    }
    
    // Parse credential data if it's a string
    const parsedData = typeof credentialData === 'string' 
      ? JSON.parse(credentialData) 
      : credentialData;
    
    // Calculate hash of the credential data
    const credentialHash = web3.utils.sha3(JSON.stringify(parsedData));
    
    const accounts = await web3.eth.getAccounts();
    const gasLimit = 20000000; // Set a high gas limit
    
    // Store credential hash on blockchain
    console.log(`Storing credential with ID: ${credentialId}`);
    const result = await req.contractInstance.methods
      .storeCredential(credentialId, credentialHash)
      .send({ from: accounts[0], gas: gasLimit });
    console.log(`Transaction hash: ${result.transactionHash}`);
    console.log(`Block number: ${result.blockNumber}`);
    
    // Store metadata about the credential
    const metadataJson = JSON.stringify({
      timestamp: Date.now(),
      issuer: parsedData.attributes?.find(a => a.name === "institution")?.value || "Unknown",
      type: "Academic Credential",
      blockNumber: result.blockNumber
    });
    
    await req.contractInstance.methods
      .storeMetadata(credentialId, metadataJson)
      .send({ from: accounts[0], gas: gasLimit });
    
    // Return success with transaction details
    res.json({
      success: true,
      credentialId,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error storing credential:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verify credential endpoint
app.get('/api/credentials/:id', deployContract, bridgeMiddleware, async (req, res) => {
  try {
    const credentialId = req.params.id;
    
    // Get credential hash from blockchain
    const storedHash = await req.contractInstance.methods
      .getCredential(credentialId)
      .call();
    
    if (storedHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    // Get additional information
    const metadata = await req.contractInstance.methods
      .getMetadata(credentialId)
      .call();
    const verified = storedHash !== null && storedHash !== undefined && storedHash !== '0x';
    res.json({
      success: true,
      credentialId,
      credentialHash: storedHash,
      metadata: metadata ? JSON.parse(metadata) : {},
      verified
    });
  } catch (error) {
    console.error('Error verifying credential:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Aries-Ethereum Bridge running on port ${port}`);
});

export default app;