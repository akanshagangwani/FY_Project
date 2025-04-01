const CredentialStore = artifacts.require("CredentialStore");
const fs = require('fs');
const path = require('path');

module.exports = function(deployer) {
  deployer.deploy(CredentialStore).then(() => {
    // Write deployment address to a file that the bridge can access
    const addressPath = path.join(__dirname, '../../ethereum-bridge/contract-address.txt');
    fs.writeFileSync(addressPath, CredentialStore.address);
    console.log(`Contract address saved to ${addressPath}`);
    
    // Copy ABI to bridge directory
    const buildPath = path.join(__dirname, '../build/contracts/CredentialStore.json');
    const bridgeAbiPath = path.join(__dirname, '../../ethereum-bridge/contract-abi.json');
    
    const contractJson = require(buildPath);
    fs.writeFileSync(bridgeAbiPath, JSON.stringify(contractJson.abi, null, 2));
    console.log(`Contract ABI saved to ${bridgeAbiPath}`);
  });
};