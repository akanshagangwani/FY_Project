import mongoose from 'mongoose';

const issuerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
});

const Issuer = mongoose.model('Issuer', issuerSchema);

export { Issuer };