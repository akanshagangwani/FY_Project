import Joi from 'joi';

export const createSchema = Joi.object({
  name: Joi.string().required(),
  version: Joi.string().required(),
  attributes: Joi.array().items(Joi.string()).required()
});

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

export const saveStudentCredentialValidation = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  label: Joi.string().required().messages({
    'string.base': 'Label must be a string',
    'string.empty': 'Label is required',
    'any.required': 'Label is required',
  }),
});

export const addAttributesValidation = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  label: Joi.string().required().messages({
    'string.base': 'Label must be a string',
    'string.empty': 'Label is required',
    'any.required': 'Label is required',
  }),
  additionalAttributes: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .required()
    .custom((value, helpers) => {
      if (!(value instanceof Map)) {
        return new Map(Object.entries(value));
      }
      return value;
    })
    .messages({
      'object.base': 'Additional attributes must be an object',
      'any.required': 'Additional attributes are required',
    }),
});