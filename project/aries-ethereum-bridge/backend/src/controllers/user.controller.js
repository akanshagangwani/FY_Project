import * as userServices from '../services/user.service.js';

const createUser = async (req, res) => {
    const { username, password, email } = req.body;
        userServices.createUser(username, password, email, res);
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
            userServices.loginUser( email, password, res);
};
const testtoken = async (req, res) => {
    userServices.testtoken(res);
};

export { createUser, loginUser, testtoken };