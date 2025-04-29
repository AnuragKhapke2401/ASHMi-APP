import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AuthModal from './components/Authentication/AuthModal';
import ViewProfile from './components/ViewProfile/ViewProfile'; // <-- import ViewProfile
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [time, setTime] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // <-- new state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const inactivityTimer = useRef(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api`)
      .then(res => setTime(res.data.time))
      .catch(err => console.error('Error fetching backend time:', err));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/me`, { withCredentials: true });
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
        axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, { withCredentials: true }).catch(() => {});
      }, 15 * 60 * 1000); // 15 minutes
    };

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
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
      await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      toast.success('Logged out successfully!');
      setTimeout(() => {
        window.location.href = '/'; // Redirect after a small delay
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
    setShowProfile(true); // <-- open the profile modal
  };

  const closeProfile = () => {
    setShowProfile(false); // <-- close the profile modal
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

      <Hero />

      {showAuthModal && (
        <AuthModal
          onClose={closeAuthModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showProfile && user && (
        <ViewProfile 
          user={user} 
          onClose={closeProfile} 
          setUser={setUser} 
        />
      )}

      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Backend Time:</h1>
        <p>{time || 'Loading...'}</p>
      </div>
    </div>
  );
}

export default App;
