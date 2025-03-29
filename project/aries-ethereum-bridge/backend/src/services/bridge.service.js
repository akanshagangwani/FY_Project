import axios from 'axios';
import config from '../config/index.js';

/**
 * Service for communicating with the Ethereum bridge
 * Handles credential storage and verification on blockchain
 */
class BridgeService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: config.BRIDGE_URL || 'http://localhost:3000',
      timeout: 10000
    });
  }

  /**
   * Store credential hash on the blockchain
   * @param {string} credentialId - The Aries credential exchange ID
   * @param {object} credentialData - The credential data to hash and store
   * @returns {Promise<object>} Blockchain transaction details
   */
  async storeCredential(credentialId, credentialData) {
    try {
      const response = await this.apiClient.post('/api/credentials', {
        credentialId,
        credentialData: JSON.stringify(credentialData)
      });
      
      return response.data;
    } catch (error) {
      console.error('Error storing credential on blockchain:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verify a credential on the blockchain
   * @param {string} credentialId - The credential ID to verify
   * @returns {Promise<object>} Verification result
   */
  async verifyCredential(credentialId) {
    try {
      const response = await this.apiClient.get(`/api/credentials/${credentialId}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying credential on blockchain:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Check if the bridge service is healthy
   * @returns {Promise<boolean>} True if bridge is healthy
   */
  async checkHealth() {
    try {
      const response = await this.apiClient.get('/api/health');
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Error checking bridge health:', error.message);
      return false;
    }
  }

  /**
   * Force contract deployment
   * @returns {Promise<object>} Deployment result
   */
  async deployContract() {
    try {
      const response = await this.apiClient.post('/api/deploy');
      return response.data;
    } catch (error) {
      console.error('Error deploying contract:', error.response?.data || error.message);
      throw error;
    }
  }
}

const bridgeService = new BridgeService();
export default bridgeService;