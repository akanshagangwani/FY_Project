import ariesService from '../services/aries.service.js';
import bridgeService from '../services/bridge.service.js';

// Issue academic credential
export const issueAcademicCredential = async (req, res, next) => {
  try {
    const { 
      connectionId, 
      studentName, 
      studentId, 
      degree, 
      graduationDate, 
      institution,
      courses = [],
      gpa
    } = req.body;
    
    // Validate required fields
    if (!connectionId || !studentName || !studentId || !degree || !institution) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // First, ensure we have a credential definition
    let credDefId = req.body.credentialDefinitionId;
    
    if (!credDefId) {
      // Create schema if needed
      const schemaResponse = await ariesService.createSchema(
        'academic_credentials',
        '1.0',
        ['student_name', 'student_id', 'degree', 'graduation_date', 'institution', 'courses', 'gpa']
      );
      
      // Create credential definition
      const credDefResponse = await ariesService.createCredentialDefinition(
        schemaResponse.schema_id
      );
      
      credDefId = credDefResponse.credential_definition_id;
    }
    
    // Format attributes for credential
    const attributes = [
      { name: "student_name", value: studentName },
      { name: "student_id", value: studentId },
      { name: "degree", value: degree },
      { name: "graduation_date", value: graduationDate || new Date().toISOString() },
      { name: "institution", value: institution },
      { name: "courses", value: JSON.stringify(courses) },
      { name: "gpa", value: gpa ? gpa.toString() : "0.0" }
    ];
    
    // Issue credential (this will also store on blockchain via the updated service)
    const result = await ariesService.issueCredential(credDefId, attributes, connectionId);
    
    res.status(201).json({
      success: true,
      message: 'Academic credential issued successfully',
      credentialId: result.credential_exchange_id,
      blockchain: result.blockchain
    });
    
  } catch (error) {
    next(error);
  }
};

// Verify academic credential
export const verifyAcademicCredential = async (req, res, next) => {
  try {
    const { credentialId } = req.params;
    
    if (!credentialId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credential ID is required' 
      });
    }
    
    // Get credential with verification
    const result = await ariesService.getCredentialWithVerification(credentialId);
    
    res.json({
      success: true,
      verified: result.verification?.verified || false,
      credential: result,
      blockchainStatus: result.verification?.blockchain || null
    });
    
  } catch (error) {
    next(error);
  }
};