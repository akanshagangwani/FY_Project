import admin from "firebase-admin";
import fs from "fs";

const phoneNumber = "9021668284"
// Load Firebase service account key
const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"));

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

/**
 * Sends an OTP to a phone number using Firebase Authentication.
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +1234567890)
 * @returns {Promise<string>} - Returns session ID for verification.
 */
export async function sendOTP(phoneNumber) {
    try {
        const session = await auth.createSessionCookie(phoneNumber, { expiresIn: 60 * 5 * 1000 });
        return session;
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
}

/**
 * Verifies the OTP code against Firebase.
 * @param {string} phoneNumber - The phone number in E.164 format.
 * @param {string} otpCode - The OTP code received by the user.
 * @returns {Promise<string>} - Returns the verified user ID.
 */
export async function verifyOTP(phoneNumber, otpCode) {
    try {
        const user = await auth.verifyIdToken(otpCode);
        if (user.phone_number !== phoneNumber) {
            throw new Error("Phone number mismatch");
        }
        return user.uid; // Verified User ID
    } catch (error) {
        throw new Error(`OTP verification failed: ${error.message}`);
    }
}
