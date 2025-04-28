const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id, email: decoded.email });
  } catch (err) {
    console.error('JWT Verify Error:', err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
