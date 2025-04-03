import Joi from 'joi';

export const createSchema = Joi.object({});

export const createCredentialDefinition = Joi.object({
  schemaId: Joi.string().required()
});

export const issueCredential = Joi.object({
  credentialDefinitionId: Joi.string().required(),
  connectionId: Joi.string().required(),
  studentName: Joi.string().required(),
  studentId: Joi.string().required(),
  degree: Joi.string().required(),
  graduationDate: Joi.string().required(),
  institution: Joi.string().required(),
  courses: Joi.array().items(Joi.string()),
  gpa: Joi.string().required()
});

export const verifyCredential = Joi.object({
  credentialId: Joi.string().required()
});

export const getCredentialDetails = Joi.object({
  credentialId: Joi.string().required()
}); 