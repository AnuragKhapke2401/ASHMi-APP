import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import './AuthStyles.css';

const RegisterForm = ({ switchToLogin }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const showPopup = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 'Weak';
    if (password.length >= 8) {
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[\W_]/.test(password);
      const score = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

      if (score === 4) strength = 'Strong';
      else if (score >= 2) strength = 'Medium';
    }
    setPasswordStrength(strength);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const sendOtp = async () => {
    const { fullName, email, mobile } = form;

    if (!fullName || !email || !mobile) {
      showPopup('Please fill all details before sending OTP', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showPopup('Invalid email format', 'error');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      showPopup('Mobile number must be 10 digits', 'error');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, {
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      }, { withCredentials: true });

      if (res.data.message === 'OTP sent successfully') {
        setOtpSent(true);
        setTimer(120);
        showPopup('OTP sent to email!', 'success');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        showPopup('Email already exists', 'error');
      } else {
        showPopup(err.response?.data?.message || 'OTP send failed', 'error');
      }
    }
  };

  const resendOtp = () => {
    if (timer === 0) sendOtp();
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedForm = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      otp: form.otp.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    if (!/^\d{6}$/.test(trimmedForm.otp)) {
      showPopup('OTP must be 6 digits', 'error');
      return;
    }

    if (!validatePassword(trimmedForm.password)) {
      showPopup('Password must be 8+ chars and include upper, lower, number, and symbol', 'error');
      return;
    }

    if (trimmedForm.password !== trimmedForm.confirmPassword) {
      showPopup('Passwords do not match', 'error');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, trimmedForm, {
        withCredentials: true,
      });

      showPopup(res.data.message || 'Registered!', 'success');
      setTimeout(() => switchToLogin(), 2000);
    } catch (err) {
      showPopup(err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Register</h2>

      <div className="input-container">
        <input
          type="text"
          name="fullName"
          placeholder="Enter Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-container">
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          name="mobile"
          placeholder="Enter Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          required
        />
      </div>

      {!otpSent && (
        <button type="button" className="send-otp" onClick={sendOtp}>
          Send OTP
        </button>
      )}

      {otpSent && (
        <>
          <div className="input-container">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
            />
            {timer > 0 ? (
              <span className="otp-icon disabled">{formatTime(timer)}</span>
            ) : (
              <span className="otp-icon" onClick={resendOtp}>Resend</span>
            )}
          </div>

          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password (min 8 chars, strong)"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

          {form.password && (
            <div className="password-strength-bar">
              <div className={`bar ${passwordStrength.toLowerCase()}`}></div>
            </div>
          )}

          <div className="input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

          <button type="submit">Register</button>
        </>
      )}

      <p className="link-text" onClick={switchToLogin}>
        Already have an account? Login
      </p>

      {message && (
        <div className={`popup-message ${messageType}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
