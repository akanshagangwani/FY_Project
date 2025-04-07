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
  // Only connectionId is absolutely required
  connectionId: Joi.string().required(),
  
  // Make credential definition optional (service can handle it)
  credentialDefinitionId: Joi.string(),
  
  // Standard academic attributes - all optional
  studentName: Joi.string(),
  studentId: Joi.string(),
  degree: Joi.string(),
  graduationDate: Joi.string(),
  institution: Joi.string(),
  courses: Joi.array().items(Joi.string()),
  gpa: Joi.string()
})
// Allow any additional fields beyond the defined schema
.unknown(true);

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