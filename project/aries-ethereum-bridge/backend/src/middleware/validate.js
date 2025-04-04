import Joi from 'joi';
import pick from '../Utils/pick.js';
import ApiError from '../Utils/ApiError.js';
import httpStatus from 'http-status';

const validate = (schema) => (req, res, next) => {
    try {
        const validSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validSchema));
        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' } })
            .validate(object);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }
        Object.assign(req, value);
        return next();
    } catch (err) {
        return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
    }
};

export default validate;