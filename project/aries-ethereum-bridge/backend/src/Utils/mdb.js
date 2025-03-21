import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb+srv://anurags:admin@cluster0.jc6rf.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    token: { type: String }
});

const User = mongoose.model('User', userSchema);

export { User };
