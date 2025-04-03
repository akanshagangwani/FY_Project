import ariesService from './aries.service.js';
import bridgeService from './bridge.service.js';

class AcademicService {
  constructor() {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      throw error;
    }
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        attributes,
        connectionId
      );

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      // Store credential on blockchain
      const blockchainResponse = await bridgeService.storeCredential(
        credential.credential_exchange_id,
        credential
      );

      return {
        ...credential,
        blockchain: blockchainResponse
=======
      return {
        credentialId: result.credential_exchange_id,
        blockchain: result.blockchain
>>>>>>> Stashed changes
=======
      return {
        credentialId: result.credential_exchange_id,
        blockchain: result.blockchain
>>>>>>> Stashed changes
      };
    } catch (error) {
      console.error('Error issuing academic credential:', error);
      throw error;
    }
  }

  // Verify academic credential
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  async verifyAcademicCredential(credentialId) {
    try {
      const verification = await ariesService.getCredentialWithVerification(credentialId);
      return verification;
=======
=======
>>>>>>> Stashed changes
  async verifyCredential(credentialId) {
    try {
      const result = await ariesService.getCredentialWithVerification(credentialId);
      
      return {
        verified: result.verification?.verified || false,
        credential: result,
        blockchainStatus: result.verification?.blockchain || null
      };
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    } catch (error) {
      console.error('Error verifying academic credential:', error);
      throw error;
    }
  }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}

export default new AcademicService(); 