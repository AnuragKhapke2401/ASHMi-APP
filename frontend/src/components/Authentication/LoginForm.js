import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import './AuthStyles.css';

const LoginForm = ({ switchToRegister, onLoginSuccess }) => {  // <-- Added onLoginSuccess
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email: form.email,
        password: form.password,
      }, { withCredentials: true });

      if (res.data.message === 'Login successful') {
        showPopup('Login successful! Redirecting...', 'success');

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess({ email: form.email });  // <-- Call parent to update user
          }
        }, 1000);

      } else {
        showPopup(res.data.message || 'Login failed', 'error');
      }
    } catch (err) {
      showPopup(err.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Login</h2>

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
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
        </span>
      </div>

      <button type="submit">Login</button>

      <p className="link-text" onClick={switchToRegister}>
        Don't have an account? Register
      </p>

      {message && (
        <div className={`popup-message ${messageType}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
