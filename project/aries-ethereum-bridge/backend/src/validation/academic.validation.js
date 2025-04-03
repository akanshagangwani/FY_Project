import Joi from 'joi';

export const createCredentialDefinition = Joi.object({
  schemaId: Joi.string().required()
});

export const issueCredential = Joi.object({
  credentialDefinitionId: Joi.string().required(),
  studentData: Joi.object({
    studentId: Joi.string().required(),
    name: Joi.string().required(),
    degree: Joi.string().required(),
    institution: Joi.string().required(),
    year: Joi.string().required(),
    gpa: Joi.string().required(),
    major: Joi.string().required()
  }).required(),
  connectionId: Joi.string().required()
});

export const verifyCredential = Joi.object({
  credentialId: Joi.string().required()
}); 