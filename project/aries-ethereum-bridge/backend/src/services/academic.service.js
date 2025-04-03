import ariesService from './aries.service.js';
import bridgeService from './bridge.service.js';

class AcademicService {
  constructor() {
    this.schemaName = 'AcademicCredential';
    this.schemaVersion = '1.0';
  }

  // Create academic schema
  async createAcademicSchema() {
    const attributes = [
      'studentId',
      'name',
      'degree',
      'institution',
      'year',
      'gpa',
      'major'
    ];

    try {
      const schema = await ariesService.createSchema(
        this.schemaName,
        this.schemaVersion,
        attributes
      );
      return schema;
    } catch (error) {
      console.error('Error creating academic schema:', error);
      throw error;
    }
  }

  // Create academic credential definition
  async createAcademicCredentialDefinition(schemaId) {
    try {
      const credentialDefinition = await ariesService.createCredentialDefinition(
        schemaId,
        'academic'
      );
      return credentialDefinition;
    } catch (error) {
      console.error('Error creating academic credential definition:', error);
      throw error;
    }
  }

  // Issue academic credential
  async issueAcademicCredential(credentialDefinitionId, studentData, connectionId) {
    try {
      const attributes = [
        { name: 'studentId', value: studentData.studentId },
        { name: 'name', value: studentData.name },
        { name: 'degree', value: studentData.degree },
        { name: 'institution', value: studentData.institution },
        { name: 'year', value: studentData.year },
        { name: 'gpa', value: studentData.gpa },
        { name: 'major', value: studentData.major }
      ];

      const credential = await ariesService.issueCredential(
        credentialDefinitionId,
        attributes,
        connectionId
      );

      // Store credential on blockchain
      const blockchainResponse = await bridgeService.storeCredential(
        credential.credential_exchange_id,
        credential
      );

      return {
        ...credential,
        blockchain: blockchainResponse
      };
    } catch (error) {
      console.error('Error issuing academic credential:', error);
      throw error;
    }
  }

  // Verify academic credential
  async verifyAcademicCredential(credentialId) {
    try {
      const verification = await ariesService.getCredentialWithVerification(credentialId);
      return verification;
    } catch (error) {
      console.error('Error verifying academic credential:', error);
      throw error;
    }
  }
}

export default new AcademicService(); 