import * as userServices from '../services/user.service.js';

const createUser = async (req, res) => {
    const { username, password, email, context } = req.body;

    if(context == "issuer") {
    userServices.createIssuer(username, password, email, res);
    }
    else if(context == "holder") {
        userServices.createUser(username, password, email, res);
    }
    else {
        res.status(400).json({ error: 'Invalid context' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(context == "issuer") {
        userServices.loginIssuer(username, password, email, res);
        }
        else if(context == "holder") {
            userServices.loginUser(username, password, email, res);
        }
        else {
            res.status(400).json({ error: 'Invalid context' });
        }
};
const testtoken = async (req, res) => {
    userServices.testtoken(res);
};

export { createUser, loginUser, testtoken };