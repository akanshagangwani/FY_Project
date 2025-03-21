import axios from 'axios';
import config from '../config/index.js';
import bridgeService from './bridge.service.js';

class AriesService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: config.ARIES_ADMIN_URL,
      timeout: 10000,
      headers: config.ARIES_ADMIN_API_KEY 
        ? { 'X-API-Key': config.ARIES_ADMIN_API_KEY }
        : {}
    });
  }

  // Create a schema
  async createSchema(name, version, attributes) {
    try {
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

  // Issue a credential
  async issueCredential(credDefId, attributes, connectionId) {
    try {
      const credential = {
        auto_remove: false,
        credential_definition_id: credDefId,
        credential_proposal: {
          attributes: attributes
        },
        connection_id: connectionId,
        trace: true
      };
      
      const response = await this.apiClient.post('/issue-credential/send', credential);
      
      // Notify bridge service (optional)
      try {
        await axios.post(`${config.BRIDGE_URL}/webhooks`, {
          topic: "issue_credential",
          state: "credential_issued",
          credential_exchange_id: response.data.credential_exchange_id,
          schema_id: response.data.schema_id,
          credential_definition_id: credDefId
        });
      } catch (bridgeError) {
        console.warn('Warning: Could not notify bridge service:', bridgeError.message);
        // Continue anyway since credential was issued
      }
      
      return response.data;
    } catch (error) {
      console.error('Error issuing credential:', error.response?.data || error.message);
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
      const response = await this.apiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error getting agent status:', error.response?.data || error.message);
      throw error;
    }
  }

  async issueCredential(credDefId, attributes, connectionId) {
    try {
      // Format attributes properly for Aries
      const formattedAttributes = Array.isArray(attributes) 
        ? attributes 
        : Object.entries(attributes).map(([name, value]) => ({ name, value }));
      
      const credential = {
        auto_remove: false,
        credential_definition_id: credDefId,
        credential_proposal: {
          "@type": "issue-credential/1.0/credential-preview",
          attributes: formattedAttributes
        },
        connection_id: connectionId,
        trace: true
      };
      
      // Issue credential through Aries
      const response = await this.apiClient.post('/issue-credential/send', credential);
      
      // Store on blockchain via bridge
      try {
        const blockchainResponse = await bridgeService.storeCredential(
          response.data.credential_exchange_id,
          {
            credentialId: response.data.credential_exchange_id,
            schemaId: response.data.schema_id,
            credentialDefId: credDefId,
            connectionId: connectionId,
            attributes: formattedAttributes,
            issuanceDate: new Date().toISOString()
          }
        );
        
        // Store transaction ID back in Aries metadata (if possible)
        if (blockchainResponse.transactionHash) {
          try {
            await this.apiClient.post(`/issue-credential/records/${response.data.credential_exchange_id}/send-message`, {
              message_type: "aries.transaction",
              content: {
                transaction_id: blockchainResponse.transactionHash,
                blockchain: "ethereum"
              }
            });
          } catch (metadataError) {
            console.warn('Could not store transaction ID in Aries:', metadataError.message);
          }
        }
        
        // Return combined response
        return {
          ...response.data,
          blockchain: {
            stored: true,
            transactionHash: blockchainResponse.transactionHash
          }
        };
      } catch (blockchainError) {
        console.warn('Warning: Credential issued but not stored on blockchain:', blockchainError.message);
        
        // Return partial success
        return {
          ...response.data,
          blockchain: {
            stored: false,
            error: blockchainError.message
          }
        };
      }
    } catch (error) {
      console.error('Error issuing credential:', error.response?.data || error.message);
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

}

const ariesService = new AriesService();
export default ariesService;