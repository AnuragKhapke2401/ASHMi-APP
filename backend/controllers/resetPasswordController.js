const bcrypt = require('bcrypt');
const db = require('../config/db');
const redisClient = require('../config/redis');
const { validateResetToken } = require('../utils/validateResetToken');
const { hashPassword } = require('../utils/hashPassword');

exports.resetPassword = async (req, res) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  if (!email || !token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.',
    });
  }

  try {
    // Validate token from Redis
    const storedToken = await redisClient.get(`resetToken:${email}`);
    if (!storedToken || storedToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const hashed = await hashPassword(newPassword);

    // Update password in database
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);

    // Invalidate token
    await redisClient.del(`resetToken:${email}`);

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
