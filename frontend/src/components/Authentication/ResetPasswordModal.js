import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import './AuthStyles.css';

const ResetPasswordModal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailParam = searchParams.get('email');
  const tokenParam = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    if (!emailParam || !tokenParam || !validateEmail(emailParam)) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token.' });
      setTimeout(() => navigate('/'), 3000);
    }
  }, [emailParam, tokenParam, navigate]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return setMessage({ type: 'error', text: 'Please fill all fields.' });
    }

    if (!passwordRegex.test(newPassword)) {
      return setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.',
      });
    }

    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: decodeURIComponent(emailParam),
          token: decodeURIComponent(tokenParam),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      setMessage({ type: 'success', text: data.message });
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);
  };

  return (
    <div className="auth-modal-background">
      <div className="auth-modal">
        <form className="auth-form" onSubmit={handleReset}>
          <h2>Reset Password</h2>

          <div className="input-container">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
            <span className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

          {newPassword && (
            <div className="password-strength-bar">
              <div className={`bar ${passwordStrength.toLowerCase()}`}></div>
            </div>
          )}

          <div className="input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          {message && (
            <div className={`popup-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
