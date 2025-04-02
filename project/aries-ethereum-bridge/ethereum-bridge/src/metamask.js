import Web3 from 'web3';

/**
 * MetaMask integration module for connecting to Ethereum blockchain
 */
class MetaMaskIntegration {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.chainId = null;
    this.contract = null;
    this.contractAddress = null;
    this.contractABI = null;
  }

  /**
   * Initialize MetaMask connection
   * @returns {Promise<boolean>} - Whether connection was successful
   */
  async connect() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.account = accounts[0];
      
      // Get the chain ID
      this.chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Initialize Web3
      this.web3 = new Web3(window.ethereum);
      
      console.log('Connected to MetaMask account:', this.account);
      console.log('Connected to network with chain ID:', this.chainId);
      
      return true;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  /**
   * Initialize contract with ABI and address
   * @param {string} contractAddress - The address of the deployed contract
   * @param {Array} contractABI - The ABI of the contract
   */
  initContract(contractAddress, contractABI) {
    if (!this.web3) {
      throw new Error('Web3 not initialized. Call connect() first.');
    }
    
    this.contractAddress = contractAddress;
    this.contractABI = contractABI;
    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
    
    console.log('Contract initialized at address:', contractAddress);
  }

  /**
   * Store a credential on the blockchain
   * @param {string} credentialId - The ID of the credential
   * @param {string} credentialData - The credential data to store
   * @returns {Promise<Object>} - Transaction result
   */
  async storeCredential(credentialId, credentialData) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call initContract() first.');
    }
    
    try {
      // Calculate hash of the credential data
      const credentialHash = this.web3.utils.sha3(JSON.stringify(credentialData));
      
      // Store credential hash on blockchain
      console.log(`Storing credential with ID: ${credentialId}`);
      const result = await this.contract.methods
        .storeCredential(credentialId, credentialHash)
        .send({ from: this.account });
      
      console.log(`Transaction hash: ${result.transactionHash}`);
      console.log(`Block number: ${result.blockNumber}`);
      
      // Store metadata about the credential
      const metadataJson = JSON.stringify({
        timestamp: Date.now(),
        issuer: credentialData.attributes?.find(a => a.name === "institution")?.value || "Unknown",
        type: "Academic Credential",
        blockNumber: result.blockNumber
      });
      
      await this.contract.methods
        .storeMetadata(credentialId, metadataJson)
        .send({ from: this.account });
      
      return {
        success: true,
        credentialId,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error storing credential:', error);
      throw error;
    }
  }

  /**
   * Verify a credential on the blockchain
   * @param {string} credentialId - The ID of the credential to verify
   * @returns {Promise<Object>} - Verification result
   */
  async verifyCredential(credentialId) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call initContract() first.');
    }
    
    try {
      // Get credential hash from blockchain
      const storedHash = await this.contract.methods
        .getCredential(credentialId)
        .call();
      
      if (storedHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        return { success: false, error: 'Credential not found' };
      }
      
      // Get additional information
      const metadata = await this.contract.methods
        .getMetadata(credentialId)
        .call();
      
      const verified = storedHash !== null && storedHash !== undefined && storedHash !== '0x';
      
      return {
        success: true,
        credentialId,
        credentialHash: storedHash,
        metadata: metadata ? JSON.parse(metadata) : {},
        verified
      };
    } catch (error) {
      console.error('Error verifying credential:', error);
      throw error;
    }
  }

  /**
   * Listen for account changes
   * @param {Function} callback - Function to call when account changes
   */
  onAccountChange(callback) {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    
    window.ethereum.on('accountsChanged', (accounts) => {
      this.account = accounts[0];
      callback(this.account);
    });
  }

  /**
   * Listen for network changes
   * @param {Function} callback - Function to call when network changes
   */
  onNetworkChange(callback) {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    
    window.ethereum.on('chainChanged', (chainId) => {
      this.chainId = chainId;
      callback(chainId);
    });
  }
}

export default MetaMaskIntegration; 