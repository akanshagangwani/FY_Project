import Joi from 'joi';

const createUser = {
    body: Joi.object().keys({
        username : Joi.string().required(),
        password : Joi.string().required(),
        email : Joi.string().email().required()
    })
};

const loginUser = {
    body: Joi.object().keys({
        email : Joi.string().email().required(),
        password : Joi.string().required(),
    })
};
const testtoken = {
    body: Joi.object().keys({
    })
};

export default { createUser, loginUser, testtoken };