const express = require('express');
const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');

// Initialize Express
const app = express();
app.use(express.json());

// Initialize Web3
const web3 = new Web3(process.env.ETH_RPC_URL || 'http://ganache:8545');
const ariesAdminUrl = process.env.ARIES_ADMIN_URL || 'http://aries-agent:8010';
const ariesApiKey = process.env.ARIES_ADMIN_API_KEY || '';

// Contract variables
let contract;
let accounts;

// Update the initWeb3 function to be more resilient

// Initialize web3 and contract
async function initWeb3() {
  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1} to connect to Ethereum...`);
      
      // Check if Ganache is accessible
      accounts = await web3.eth.getAccounts();
      console.log('Connected to Ethereum with account:', accounts[0]);
      
      // Check balance
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log('Account balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
      
      // Check for contract address and ABI files
      if (fs.existsSync('./contract-address.txt') && fs.existsSync('./contract-abi.json')) {
        const contractAddress = fs.readFileSync('./contract-address.txt', 'utf8').trim();
        const contractABI = JSON.parse(fs.readFileSync('./contract-abi.json', 'utf8'));
        
        // Initialize contract
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log('Contract initialized at address:', contractAddress);
        
        // Don't test the contract during initialization - it might not be deployed yet
        console.log('Contract loaded - will be tested when first transaction is sent');
        return; // Successfully initialized
      } else {
        console.log('Contract address or ABI not found. Service will run without contract integration until files are available.');
        return; // Continue without contract
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error.message);
      retries++;
      
      if (retries >= maxRetries) {
        console.error('Failed to initialize web3 after multiple attempts.');
        console.error('Service will continue, but Ethereum functionality will not be available.');
        return;
      }
      
      // Wait before retrying
      console.log(`Waiting 5 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Webhook endpoint for Aries events
app.post('/webhooks', async (req, res) => {
  try {
    const event = req.body;
    console.log('Received webhook event:', JSON.stringify(event, null, 2));
    
    // Handle different events from Aries
    if (event.topic === 'issue_credential' && event.state === 'credential_issued') {
      // Store credential metadata on Ethereum
      await storeOnEthereum('credential_' + event.credential_exchange_id, JSON.stringify({
        credential_id: event.credential_exchange_id,
        schema_id: event.schema_id || 'unknown',
        timestamp: new Date().toISOString()
      }));
    }
    
    res.status(200).send('Event processed');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing event');
  }
});

// Store data on Ethereum
async function storeOnEthereum(id, data) {
  if (!contract || !accounts || accounts.length === 0) {
    console.error('Contract or accounts not initialized');
    return;
  }
  
  try {
    console.log(`Storing data on Ethereum: ${id}`);
    console.log(`Data: ${data}`);
    
    // Trim data if too long
    if (data.length > 1000) {
      data = data.substring(0, 1000) + '...';
      console.log('Data trimmed to 1000 characters');
    }
    
    // Try to store with increased gas limits
    const tx = await contract.methods.storeData(id, data).send({
      from: accounts[0],
      gas: 500000,
      gasPrice: '1000000000' // 1 gwei
    });
    console.log(`Transaction hash: ${tx.transactionHash}`);
    
    // Verify the data was stored
    const storedData = await contract.methods.getData(id).call();
    console.log(`Verified data: ${storedData}`);
    
    return tx;
  } catch (error) {
    console.error('Error storing data on Ethereum:', error.message);
    // Try with simplified data as fallback
    try {
      const fallbackData = JSON.stringify({
        id: id,
        timestamp: new Date().toISOString(),
        error: "Original data too complex"
      });
      console.log('Retrying with simplified data');
      const tx = await contract.methods.storeData(id, fallbackData).send({
        from: accounts[0],
        gas: 500000,
        gasPrice: '1000000000'
      });
      console.log(`Fallback transaction hash: ${tx.transactionHash}`);
      return tx;
    } catch (retryError) {
      console.error('Fallback store also failed:', retryError.message);
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    ethereum: contract ? 'connected' : 'not connected',
    contractAddress: fs.existsSync('./contract-address.txt') ? 
      fs.readFileSync('./contract-address.txt', 'utf8').trim() : 'not set'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bridge service running on port ${PORT}`);
  initWeb3();
});