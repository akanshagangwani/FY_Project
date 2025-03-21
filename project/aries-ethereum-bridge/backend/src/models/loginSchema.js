import Joi from 'joi';

// Define the login schema
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required'
    })
});

export {loginSchema};