const db = require('../config/db');
const redis = require('../config/redis');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendResetEmail = require('../utils/sendResetEmail');

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60; // 15 minutes in seconds

// Utility: Check and increment attempt count
async function checkAndIncrementAttempts(email) {
  const key = `reset_attempts:${email}`;

  const attempts = await redis.get(key);

  if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
    return false; // Blocked
  }

  // Increment or initialize
  await redis.multi()
    .incr(key)
    .expire(key, BLOCK_DURATION)
    .exec();

  return true;
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: 'Email is required' });

  try {
    // Check if blocked
    const allowed = await checkAndIncrementAttempts(email);
    if (!allowed)
      return res.status(429).json({ message: 'Too many attempts. Please try again after 15 minutes.' });

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0)
      return res.status(404).json({ message: 'No user found with that email' });

    // Invalidate any previous token
    await redis.del(`reset:${email}`);

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await redis.setEx(`reset:${email}`, 600, tokenHash); // valid for 10 minutes

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

    await sendResetEmail(email, user[0].fullName, resetUrl);

    return res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send reset link' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  if (!email || !token || !newPassword || !confirmPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  if (newPassword.length < 8)
    return res.status(400).json({ message: 'Password must be at least 8 characters' });

  try {
    // Check if blocked
    const allowed = await checkAndIncrementAttempts(email);
    if (!allowed)
      return res.status(429).json({ message: 'Too many attempts. Please try again after 15 minutes.' });

    const storedToken = await redis.get(`reset:${email}`);
    if (!storedToken)
      return res.status(400).json({ message: 'Reset token expired or invalid' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (hashedToken !== storedToken)
      return res.status(401).json({ message: 'Invalid reset token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    // Cleanup token and reset attempt count
    await redis.del(`reset:${email}`);
    await redis.del(`reset_attempts:${email}`);

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};
