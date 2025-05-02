// AuthModal.js
import React, { useRef, useEffect, useState } from 'react';
import './AuthStyles.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordModal from './ForgotPasswordModal'; // Import

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div className="auth-modal-background">
      <div className="auth-modal" ref={modalRef}>
        {showForgotPassword ? (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        ) : isLogin ? (
          <LoginForm
            switchToRegister={() => setIsLogin(false)}
            onLoginSuccess={onLoginSuccess}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        ) : (
          <RegisterForm switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
