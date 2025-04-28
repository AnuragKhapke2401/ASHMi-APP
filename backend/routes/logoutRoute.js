const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisClient = require('../config/redis');
const router = express.Router();

// GET /api/auth/logout
router.get('/logout', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ message: 'Already logged out' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Create the same hashed token used during login
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Remove session from Redis
    await redisClient.del(`session:${decoded.id}`);

  } catch (err) {
    console.error('Error during logout:', err.message || err);
    // Token might already be expired, still continue to clear cookie
  }

  // Always clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
