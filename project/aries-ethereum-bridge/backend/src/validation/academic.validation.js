import Joi from 'joi';

// Schema for issuing academic credential
const issueAcademicCredential = {
  body: Joi.object().keys({
    connectionId: Joi.string().required(),
    studentName: Joi.string().required()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s-']+$/)
      .messages({
        'string.pattern.base': 'Student name can only contain letters, spaces, hyphens, and apostrophes',
        'string.min': 'Student name must be at least 2 characters long',
        'string.max': 'Student name cannot exceed 100 characters'
      }),
    studentId: Joi.string().required()
      .pattern(/^[A-Z0-9-]+$/)
      .messages({
        'string.pattern.base': 'Student ID can only contain uppercase letters, numbers, and hyphens'
      }),
    degree: Joi.string().required()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Degree must be at least 2 characters long',
        'string.max': 'Degree cannot exceed 100 characters'
      }),
    graduationDate: Joi.string().isoDate()
      .optional()
      .messages({
        'string.isoDate': 'Graduation date must be a valid ISO date'
      }),
    institution: Joi.string().required()
      .min(2)
      .max(200)
      .messages({
        'string.min': 'Institution name must be at least 2 characters long',
        'string.max': 'Institution name cannot exceed 200 characters'
      }),
    courses: Joi.array().items(
      Joi.string().min(2).max(100)
    ).default([])
    .messages({
      'array.base': 'Courses must be an array',
      'string.min': 'Course name must be at least 2 characters long',
      'string.max': 'Course name cannot exceed 100 characters'
    }),
    gpa: Joi.number().min(0).max(4)
      .optional()
      .messages({
        'number.min': 'GPA cannot be less than 0',
        'number.max': 'GPA cannot be greater than 4'
      }),
    credentialDefinitionId: Joi.string().optional()
  })
};

// Schema for verifying academic credential
const verifyAcademicCredential = {
  params: Joi.object().keys({
    credentialId: Joi.string().required()
      .pattern(/^[a-f0-9-]+$/)
      .messages({
        'string.pattern.base': 'Credential ID must be a valid UUID format'
      })
  })
};

export default {
  issueAcademicCredential,
  verifyAcademicCredential
}; 