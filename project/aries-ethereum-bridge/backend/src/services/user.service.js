import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../Utils/mdb.js';
import { loginSchema } from '../models/loginSchema.js';
import verifyDomain from '../Utils/verify.Domain.js'; 
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET ; // Replace with your actual secret key

async function createUser(username, password, email, res) {
    try {
        // Verify the domain before proceeding
        const isDomainValid = await verifyDomain(email, res);
        if (!isDomainValid) return; // Stop execution if domain is invalid

        // Check if the email or username already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).send('User with this email already exists');
            }
            if (existingUser.username === username) {
                return res.status(400).send('Username already taken');
            }
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

    // Validate the request body
    // console.log(email, password);
    const { error } = loginSchema.validate({ email, password });
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json('User not found');
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json(`Invalid password`);
        }

        // Create a time-limited token (e.g., expires in 1 hour)
        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });

        // Update the user's token in the database
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

export default deleteUser;


export { createUser, loginUser, testtoken };