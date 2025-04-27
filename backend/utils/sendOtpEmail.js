// File: utils/sendOtpEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendOtpEmail(to, otp, fullName) {
  const mailOptions = {
    from: `"ASHMiT Car Rental & Tours" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP for Registration',
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Hello ${fullName},</h2>
        <p>Use the following OTP to complete your registration:</p>
        <h3 style="color: #b388eb">${otp}</h3>
        <p>This OTP is valid for 2 minutes.</p>
        <p>Regards,<br/>ASHMiT Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
