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

module.exports = async function sendResetEmail(to, fullName, resetLink) {
  const mailOptions = {
    from: `"ASHMiT Car Rental & Tours" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${fullName},</h2>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}" target="_blank" style="display:inline-block;padding:10px 20px;background:#6a1b9a;color:white;text-decoration:none;border-radius:30px;">Reset Password</a>
        <p>This link is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br/>
        <p>Regards,<br/>ASHMiT Team</p>
      </div>
    `,
};

  await transporter.sendMail(mailOptions);
};
