const db = require('../config/db');
const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');

// Middleware-like function to verify JWT and Redis session
const authenticate = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const redisKey = `session:${decoded.id}`;
    const storedTokenHash = await redisClient.get(redisKey);

    const currentTokenHash = require('crypto')
      .createHash('sha256')
      .update(token)
      .digest('hex');

    if (storedTokenHash !== currentTokenHash) {
      return res.status(401).json({ message: 'Unauthorized: Invalid session' });
    }

    return decoded;
  } catch (err) {
    console.error('Auth error:', err.message);
    return null;
  }
};

exports.getProfile = async (req, res) => {
  const decoded = await authenticate(req, res);
  if (!decoded) return;

  try {
    const [rows] = await db.query('SELECT fullName, email, mobile, created_at FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const decoded = await authenticate(req, res);
  if (!decoded) return;

  const { fullName, email, mobile } = req.body;

  if (!fullName || !email || !mobile) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await db.query(
      'UPDATE users SET fullName = ?, email = ?, mobile = ? WHERE id = ?',
      [fullName, email, mobile, decoded.id]
    );
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
