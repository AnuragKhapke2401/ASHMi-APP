const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const db = require('../config/db');
const redisClient = require('../config/redis');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.warn(`[WARN] Missing fields | Email: ${email}`);
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!validator.isEmail(email)) {
    console.warn(`[WARN] Invalid email format: ${email}`);
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check user in DB
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.warn(`[FAILED LOGIN] Email not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[FAILED LOGIN] Wrong password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Hash token for Redis storage
    const hashedToken = crypto.createHash('sha256').update(accessToken).digest('hex');
    await redisClient.set(`session:${user.id}`, hashedToken, { EX: 900 }); // 15 mins expiry

    // Set HTTP-only cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      refreshToken, // Optionally send refresh token in response
    });
  } catch (err) {
    console.error('Login error:', err.stack || err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = loginUser;
