// File: controllers/authController.js
const db = require('../config/db');
const redis = require('../config/redis');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const generateOTP = require('../utils/generateOTP');
const sendOtpEmail = require('../utils/sendOtpEmail');

exports.sendOtp = async (req, res) => {
  const { fullName, email, mobile } = req.body;
  if (!fullName || !email || !mobile)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0)
      return res.status(409).json({ message: 'Email already exists' });

    const otpKey = `otp:${email}`;
    const existingOtp = await redis.get(otpKey);
    if (existingOtp)
      return res.status(429).json({ message: 'OTP already sent, wait before requesting again' });

    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    await redis.setEx(otpKey, 120, hashedOtp);

    await sendOtpEmail(email, otp, fullName);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.register = async (req, res) => {
  const { fullName, email, mobile, otp, password } = req.body;

  if (!otp || !password || password.length < 8)
    return res.status(400).json({ message: 'Invalid OTP or password must be at least 8 characters' });

  try {
    const storedHashedOtp = await redis.get(`otp:${email}`);
    if (!storedHashedOtp)
      return res.status(400).json({ message: 'OTP expired or not found' });

    const hashedInputOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedInputOtp !== storedHashedOtp)
      return res.status(400).json({ message: 'Invalid OTP' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO users (fullName, email, mobile, password) VALUES (?, ?, ?, ?)', [
      fullName,
      email,
      mobile,
      hashedPassword,
    ]);

    await redis.del(`otp:${email}`);
    res.status(201).json({ message: 'Registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};