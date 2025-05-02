// ForgotPasswordModal.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSendResetLink = async () => {
    if (!email) {
      setMessage('Please enter your email.');
      setMessageType('error');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || 'Reset link sent!');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send reset link');
      setMessageType('error');
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      <div className="input-container">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="send-otp" onClick={handleSendResetLink}>
        Send Reset Link
      </button>

      {message && (
        <div className={`popup-message ${messageType}`}>
          {message}
        </div>
      )}

      <p className="link-text" onClick={onClose}>
        Back to Login
      </p>
    </div>
  );
};

export default ForgotPasswordModal;
