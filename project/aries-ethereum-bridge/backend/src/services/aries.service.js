import axios from 'axios';
import config from '../config/index.js';
import bridgeService from './bridge.service.js';

class AriesService {
  constructor() {
    console.log('Initializing Aries service with URL:', config.ARIES_ADMIN_URL);
    this.apiClient = axios.create({
      baseURL: config.ARIES_ADMIN_URL,
      timeout: 30000,
      headers: config.ARIES_ADMIN_API_KEY 
        ? { 'X-API-Key': config.ARIES_ADMIN_API_KEY }
        : {}
    });

    console.log('Aries API Client Configuration:', {
      baseURL: this.apiClient.defaults.baseURL,
      timeout: this.apiClient.defaults.timeout,
      hasApiKey: !!config.ARIES_ADMIN_API_KEY
    });
  }

  // Create a schema
  async createSchema(name, version, attributes) {
    try {
      console.log('Connecting to Aries at:', config.ARIES_ADMIN_URL);
      const response = await this.apiClient.post('/schemas', {
        schema_name: name,
        schema_version: version,
        attributes: attributes
      });
      return response.data;
    } catch (error) {
      console.error('Error creating schema:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create a credential definition
  async createCredentialDefinition(schemaId, tag = 'default') {
    try {
      const response = await this.apiClient.post('/credential-definitions', {
        schema_id: schemaId,
        tag: tag
      });
      return response.data;
    } catch (error) {
      console.error('Error creating credential definition:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get all connections
  async getConnections() {
    try {
      const response = await this.apiClient.get('/connections');
      return response.data;
    } catch (error) {
      console.error('Error fetching connections:', error.response?.data || error.message);
      throw error;
    }
  }

  // Check agent status
  async getStatus() {
    try {
      console.log('Checking Aries agent status at base URL:', this.apiClient.defaults.baseURL);
      
      // Try common Aries status endpoints
      const possibleEndpoints = [
        '/status',
        '/',
        '/status/ready',
        '/status/live'
      ];
      
      let lastError = null;
      
      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Attempting to connect to endpoint: ${endpoint}`);
          const response = await this.apiClient.get(endpoint, { timeout: 5000 }); // Shorter timeout for faster testing
          console.log(`Successfully connected to ${endpoint}`);
          return {
            status: 'active',
            message: `Connected via endpoint: ${endpoint}`,
            data: response.data
          };
        } catch (error) {
          console.log(`Failed to connect to ${endpoint}:`, error.message);
          lastError = error;
        }
      }
      
      // If we get here, all endpoints failed
      throw lastError || new Error('All status endpoints failed');
    } catch (error) {
      console.error('Error getting agent status:', error);
      throw error;
    }
  }

  // Issue credential
  async issueCredential(credentialDefinitionId, attributes, connectionId) {
    try {
      const response = await this.apiClient.post('/issue-credential/send', {
        credential_definition_id: credentialDefinitionId,
        attributes: attributes,
        connection_id: connectionId
      });
      return response.data;
    } catch (error) {
      console.error('Error issuing credential:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get credentials
  async getCredentials() {
    try {
      const response = await this.apiClient.get('/issue-credential/records');
      return response.data;
    } catch (error) {
      console.error('Error fetching credentials:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get credential with blockchain verification
  async getCredentialWithVerification(credentialId) {
    try {
      // Get from Aries
      const ariesResponse = await this.apiClient.get(`/issue-credential/records/${credentialId}`);
      
      // Verify on blockchain
      try {
        const blockchainVerification = await bridgeService.verifyCredential(credentialId);
        
        return {
          ...ariesResponse.data,
          verification: {
            verified: true,
            blockchain: blockchainVerification
          }
        };
      } catch (verificationError) {
        return {
          ...ariesResponse.data,
          verification: {
            verified: false,
            error: verificationError.message
          }
        };
      }
    } catch (error) {
      console.error('Error getting credential:', error.response?.data || error.message);
      throw error;
    }
  }

  async createPresentation(credentialId, requestedAttributes) {
    try {
      const response = await this.apiClient.post('/present-proof/send-request', {
        credentialId,
        requestedAttributes
      });
      return response.data;
    } catch (error) {
      console.error('Error creating presentation:', error.response?.data || error.message);
      throw error;
    }
  }
}

const ariesService = new AriesService();
export default ariesService;