import axios from 'axios';
import config from '../config/index.js';

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
}

const ariesService = new AriesService();
export default ariesService;