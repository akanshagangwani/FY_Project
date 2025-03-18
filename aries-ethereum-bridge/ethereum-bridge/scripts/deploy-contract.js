const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

// Initialize Web3
const web3 = new Web3(process.env.ETH_RPC_URL || 'http://localhost:8545');

async function deploy() {
  try {
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying from account:', accounts[0]);
    
    // Read contract source
    const source = fs.readFileSync('./contracts/CredentialStore.sol', 'utf8');
    
    // Compile contract
    const input = {
      language: 'Solidity',
      sources: {
        'CredentialStore.sol': {
          content: source
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };
    
    console.log('Compiling contract...');
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Extract ABI and bytecode
    const contractName = 'CredentialStore';
    const contract = compiledContract.contracts['CredentialStore.sol'][contractName];
    const bytecode = contract.evm.bytecode.object;
    const abi = contract.abi;
    
    // Save ABI to file for later use
    fs.writeFileSync('./contract-abi.json', JSON.stringify(abi, null, 2));
    console.log('Contract ABI saved to contract-abi.json');
    
    // Deploy contract
    console.log('Deploying contract...');
    const Contract = new web3.eth.Contract(abi);
    const deployTx = Contract.deploy({
      data: '0x' + bytecode
    });
    
    const gas = await deployTx.estimateGas();
    const deployedContract = await deployTx.send({
      from: accounts[0],
      gas
    });
    
    console.log('Contract deployed at address:', deployedContract.options.address);
    
    // Save address to file
    fs.writeFileSync('./contract-address.txt', deployedContract.options.address);
    console.log('Contract address saved to contract-address.txt');
    
    // Instructions for updating bridge.js
    console.log('\nUpdate your bridge.js file with:');
    console.log(`const CONTRACT_ADDRESS = '${deployedContract.options.address}';`);
    console.log(`const CONTRACT_ABI = ${JSON.stringify(abi)};`);
    
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}

deploy();