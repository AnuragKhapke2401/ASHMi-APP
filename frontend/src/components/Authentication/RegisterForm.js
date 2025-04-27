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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    const { fullName, email, mobile } = form;

    if (!fullName || !email || !mobile) {
      showPopup('Please fill all details before sending OTP', 'error');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      showPopup('Mobile number must be 10 digits', 'error');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, {
        fullName,
        email,
        mobile,
      }, { withCredentials: true });

      if (res.data.message === 'OTP sent successfully') {
        setOtpSent(true);
        setTimer(120); // 2 minutes
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
    if (timer === 0) {
      sendOtp();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(form.otp)) {
      showPopup('OTP must be 6 digits', 'error');
      return;
    }

    if (form.password.length < 8) {
      showPopup('Password must be at least 8 characters', 'error');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showPopup('Passwords do not match', 'error');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        ...form
      }, { withCredentials: true });

      if (res.data.message === 'Registered successfully') {
        showPopup('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => switchToLogin(), 2000);
      } else {
        showPopup(res.data.message || 'Registered!', 'success');
        setTimeout(() => switchToLogin(), 2000);
      }
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
              placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

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
