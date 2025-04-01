import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import fs from 'fs/promises';
const Web3 = require('web3');
const solc = require('solc');

// Initialize Web3
const web3 = new Web3(process.env.ETH_RPC_URL || 'http://localhost:8545');

const deploy = async () => {
  try {
    // Get accounts
    console.log(`Using Solidity compiler version: ${solc.version()}`);
    const accounts = await web3.eth.getAccounts();
    console.log(`Deploying from account: ${accounts[0]}`);
    
    // Read contract source
    const contractPath = process.env.CONTRACT_PATH || '../../smartcontracts/contracts/CredentialStore.sol';
    const source = await fs.readFile(contractPath, 'utf8');
    
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

    if (!compiledContract.contracts || !compiledContract.contracts['CredentialStore.sol']) {
      throw new Error('Contract compilation failed. Check your Solidity code.');
    }
    console.log('Contract compiled successfully.');
    // Extract ABI and bytecode
    const contractName = 'CredentialStore';
    const contract = compiledContract.contracts['CredentialStore.sol'][contractName];
    const { object: bytecode } = contract.evm.bytecode;
    const { abi } = contract;


    console.log('Deploying contract...');
    
    // Save ABI to file for later use
    await fs.writeFile('./contract-abi.json', JSON.stringify(abi, null, 2));
    console.log('Contract ABI saved to contract-abi.json');
    
    // Deploy contract
    console.log('Deploying contract...');
    const Contract = new web3.eth.Contract(abi);
    const deployTx = Contract.deploy({
      data: `0x${bytecode}`
    });
    
    const gas = await deployTx.estimateGas();
    const gasLimit = 8000000000000; // Set a custom gas limit
    const deployedContract = await deployTx.send({
      from: accounts[0],
      gas: Math.min(gas, gasLimit)
    });
    
    console.log(`Contract deployed at address: ${deployedContract.options.address}`);
    console.log(`Gas used for deployment: ${gas}`);
    
    // Save address to file
    await fs.writeFile('./contract-address.txt', deployedContract.options.address);
    console.log('Contract address saved to contract-address.txt');
    
    // Instructions for updating bridge.js
    console.log('\nUpdate your bridge.js file with:');
    console.log(`const CONTRACT_ADDRESS = '${deployedContract.options.address}';`);
    console.log(`const CONTRACT_ABI = ${JSON.stringify(abi)};`);
    
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
};

deploy();