import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AuthStyles.css';

const ResetPasswordModal = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return setMessage({ type: 'error', text: 'Please fill all fields.' });
    }
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      setMessage({ type: 'success', text: data.message });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-background">
      <div className="auth-modal">
        <form className="auth-form" onSubmit={handleReset}>
          <h2>Reset Password</h2>

          <div className="input-container">
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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
