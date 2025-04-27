// File: routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { sendOtp, register } = require('../controllers/authController');

router.post('/send-otp', sendOtp);
router.post('/register', register);

module.exports = router;
