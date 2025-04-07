import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../Utils/mdb.js';
import { loginSchema } from '../models/loginSchema.js';
import verifyDomain from '../Utils/verify.Domain.js'; 
import { Issuer } from '../models/issuerSchema.js';
import dotenv from 'dotenv';
dotenv.config();


const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

async function createUser(username, password, email, res) {
    try {
        // Verify the domain before proceeding
        const isDomainValid = await verifyDomain(email, res);
        if (!isDomainValid) return; // Stop execution if domain is invalid

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Generate a unique ID for the user
        const userId = uuidv4();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a time-limited token (e.g., expires in 1 hour)
        const token = jwt.sign({ userId, username, email }, secretKey, { expiresIn: '1h' });

        // Create the user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            id: userId,
            token
        });

        // Save the user to the database
        await newUser.save();

        res.json({ id: userId, username, email, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send(`Error creating user: ${error.message}`);
    }
}

async function loginUser(email, password, res) {


    const { error } = loginSchema.validate({ email, password });
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json(`Invalid password`);
        }

        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });

        user.token = token;
        await user.save();
        const response = {
            status: 'Login Successfull',
            username: user.username,
            token,
        }; 
        res.json(response);
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json(`Error logging in user: ${error.message}`);
    }
}

async function testtoken(res) {
    res.json({ message: 'Welcome' });
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json(`Error deleting user: ${error.message}`);
    }
}

async function loginIssuer(email, password, res) {
    const { error } = loginSchema.validate({ email, password });
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }
    try {
      // Find the issuer by email
        const issuer = await Issuer.findOne({ email });
        if (!issuer) {
            return res.status(400).json('Issuer not found');
        }
      // Validate the password
        const isPasswordValid = await bcrypt.compare(password, issuer.password);
        if (!isPasswordValid) {
            return res.status(400).json(`Invalid password`);
        }
        // Generate a token for the issuer
        const token = jwt.sign(
        { issuerId: issuer.id, username: issuer.username, email: issuer.email },
        secretKey,
        { expiresIn: '1h' }
        );
        // Save the token to the issuer document
        issuer.token = token;
        await issuer.save();
        // Prepare the response
        const response = {
        status: 'Login Successful',
        username: issuer.username,
        token,
        };
        res.json(response);
        } catch (error) {
        console.error('Error logging in issuer:', error);
        res.status(500).json(`Error logging in issuer: ${error.message}`);
    }
    }


    async function createIssuer(username, password, email, res) {
        try {
          // Verify the domain before proceeding
            const isDomainValid = await verifyDomain(email, res);
            if (!isDomainValid) return; // Stop execution if domain is invalid

          // Check if the issuer already exists
            const existingIssuer = await Issuer.findOne({ email });
            if (existingIssuer) {
            return res.status(400).send('Issuer already exists');
            }

          // Generate a unique ID for the issuer
            const issuerId = uuidv4();

          // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

          // Create a time-limited token (e.g., expires in 1 hour)
            const token = jwt.sign({ issuerId, username, email }, secretKey, { expiresIn: '1h' });

          // Create the issuer object
            const newIssuer = new Issuer({
            username,
            email,
            password: hashedPassword,
            id: issuerId,
            token,
        });
          // Save the issuer to the database
            await newIssuer.save();
            res.json({ id: issuerId, username, email, token });
        } catch (error) {
            console.error('Error creating issuer:', error);
            res.status(500).send(`Error creating issuer: ${error.message}`);
        }
    }

export { createUser, loginUser, testtoken, deleteUser, loginIssuer, createIssuer };