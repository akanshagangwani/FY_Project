import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
service: 'gmail', 
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
}
});

/**
 * 
 * @param {string} to - Recipient email address
 * @param {string} invitationUrl - Connection invitation URL
 * @returns {Promise} - Email sending result
 */

const sendInvitationEmail = async (to, invitationCode) => {
const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Credential Connection Invitation',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Academic Credential Connection Invitation</h2>
        <p>You've received an invitation to connect and receive academic credentials.</p>
        
        <p>Copy the invitation code below and paste it in the "Accept Invitation" section of the website:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; word-break: break-all; margin: 20px 0;">
        <code>${invitationCode}</code>
        </div>
        
        <p><strong>Note:</strong> This code will expire after 24 hours.</p>
    </div>
    `
};

return transporter.sendMail(mailOptions);
};

export { sendInvitationEmail };