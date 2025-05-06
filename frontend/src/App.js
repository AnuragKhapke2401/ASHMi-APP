import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AuthModal from './components/Authentication/AuthModal';
import ViewProfile from './components/ViewProfile/ViewProfile';
import ResetPasswordModal from './components/Authentication/ResetPasswordModal'; 
import CarSection from './components/cars/CarSection';
import PredefinedRoutes from './components/PredefinedRoutes/PredefinedRoutes';
import AboutSection from './components/AboutSection/AboutSection';
import ServicesSection from './components/ServicesSection/ServicesSection';
import ContactSection from './components/ContactSection/ContactSection';

import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const inactivityTimer = useRef(null);

  const location = useLocation(); // ✅ for detecting /reset-password
  const searchParams = new URLSearchParams(location.search);
  const resetEmail = searchParams.get('email');
  const resetToken = searchParams.get('token');
  const showResetPassword =
    location.pathname === '/reset-password' && resetEmail && resetToken;


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/me`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.log('No active session');
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setUser(null);
        toast('You have been logged out due to inactivity.');
        axios
          .get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, { withCredentials: true })
          .catch(() => {});
      }, 15 * 60 * 1000); // 15 minutes
    };

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  const handleLoginClick = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    toast.success('Login successful!');
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      setUser(null);
      toast.success('Logged out successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (err) {
      console.error('Logout failed', err);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleViewBookings = () => {
    console.log('View Bookings clicked');
  };

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar
        onLoginClick={handleLoginClick}
        user={user}
        authLoading={authLoading}
        onLogout={handleLogout}
        onViewBookings={handleViewBookings}
        onViewProfile={handleViewProfile}
      />

      <div id="home"><Hero /></div>
      <div id="cars"><CarSection /></div>
      <PredefinedRoutes />
      <div id="about"><AboutSection /></div>
      <div id="services"><ServicesSection /></div>
      <div id="contact"><ContactSection /></div>
      
      {showAuthModal && (
        <AuthModal onClose={closeAuthModal} onLoginSuccess={handleLoginSuccess} />
      )}

      {showProfile && user && (
        <ViewProfile user={user} onClose={closeProfile} setUser={setUser} />
      )}

      {showResetPassword && (
        <ResetPasswordModal email={resetEmail} token={resetToken} />
      )}
    </div>
  );
}

export default App;
