import jwt from 'jsonwebtoken';
import ApiError from '../Utils/ApiError.js';
import dotenv from 'dotenv';
import Joi from 'joi'; 
import pick from '../Utils/pick.js';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

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

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid Token' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default authenticate;