import ariesService from './aries.service.js';
import bridgeService from './bridge.service.js';

class AcademicService {
  constructor() {
    this.schemaName = 'academic_credentials';
    this.schemaVersion = '1.0';
    this.attributes = [
      'student_name',
      'student_id',
      'degree',
      'graduation_date',
      'institution',
      'courses',
      'gpa'
    ];
  }

  // Create academic schema and credential definition
  async setupAcademicCredentials() {
    try {
      // Create schema
      const schemaResponse = await ariesService.createSchema(
        this.schemaName,
        this.schemaVersion,
        this.attributes
      );

      // Create credential definition
      const credDefResponse = await ariesService.createCredentialDefinition(
        schemaResponse.schema_id
      );

      return {
        schemaId: schemaResponse.schema_id,
        credentialDefinitionId: credDefResponse.credential_definition_id
      };
    } catch (error) {
      console.error('Error setting up academic credentials:', error);
      throw error;
    }
  }

  // Format academic attributes for credential issuance
  formatAcademicAttributes(data) {
    return [
      { name: "student_name", value: data.studentName },
      { name: "student_id", value: data.studentId },
      { name: "degree", value: data.degree },
      { name: "graduation_date", value: data.graduationDate || new Date().toISOString() },
      { name: "institution", value: data.institution },
      { name: "courses", value: JSON.stringify(data.courses || []) },
      { name: "gpa", value: data.gpa ? data.gpa.toString() : "0.0" }
    ];
  }

  // Issue academic credential
  async issueCredential(data) {
    try {
      const { connectionId, credentialDefinitionId } = data;

      // Get or create credential definition
      let credDefId = credentialDefinitionId;
      if (!credDefId) {
        const setup = await this.setupAcademicCredentials();
        credDefId = setup.credentialDefinitionId;
      }

      // Format attributes
      const attributes = this.formatAcademicAttributes(data);

      // Issue credential
      const result = await ariesService.issueCredential(
        credDefId,
        attributes,
        connectionId
      );

      return {
        credentialId: result.credential_exchange_id,
        blockchain: result.blockchain
      };
    } catch (error) {
      console.error('Error issuing academic credential:', error);
      throw error;
    }
  }

  // Verify academic credential
  async verifyCredential(credentialId) {
    try {
      const result = await ariesService.getCredentialWithVerification(credentialId);
      
      return {
        verified: result.verification?.verified || false,
        credential: result,
        blockchainStatus: result.verification?.blockchain || null
      };
    } catch (error) {
      console.error('Error verifying academic credential:', error);
      throw error;
    }
  }

  // Get academic credential details
  async getCredentialDetails(credentialId) {
    try {
      const result = await ariesService.getCredentialWithVerification(credentialId);
      
      if (!result.credential) {
        throw new Error('Credential not found');
      }

      // Extract and format academic-specific data
      const attributes = result.credential.credential_proposal_dict?.credential_proposal?.attributes || [];
      const formattedData = {};
      
      attributes.forEach(attr => {
        if (attr.name === 'courses') {
          formattedData[attr.name] = JSON.parse(attr.value);
        } else {
          formattedData[attr.name] = attr.value;
        }
      });

      return {
        ...formattedData,
        verified: result.verification?.verified || false,
        blockchainStatus: result.verification?.blockchain || null
      };
    } catch (error) {
      console.error('Error getting academic credential details:', error);
      throw error;
    }
  }
}

export default new AcademicService(); 