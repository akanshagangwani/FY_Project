import jwt from 'jsonwebtoken';
import ApiError from '../Utils/ApiError.js';
const secretKey = '77c92a03f526dbd4d46ef422f95b4f71'; // Make sure to use the same secret key used for signing the token

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    next();
}

const authenticate = (schema) => (req, res, next) => {
    try {
        verifyToken(req, res, next);
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

export default authenticate;