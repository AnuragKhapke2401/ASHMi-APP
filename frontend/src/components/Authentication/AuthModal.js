import React, { useRef, useEffect } from 'react';
import './AuthStyles.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const modalRef = useRef(null);

  // Close modal when clicking outside of it
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
        {isLogin ? (
          <LoginForm switchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
