import Joi from 'joi';

// Schema for creating schema
const createSchema = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        version: Joi.string().required(),
        attributes: Joi.array().items(Joi.string()).required()
    })
};

// Schema for creating credential definition
const createCredentialDefinition = {
    body: Joi.object().keys({
        schemaId: Joi.string().required(),
        tag: Joi.string().optional()
    })
};

export default {
    createSchema,
    createCredentialDefinition,
}; 