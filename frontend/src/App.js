import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AuthModal from './components/Authentication/AuthModal';

function App() {
  const [time, setTime] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api`)
      .then(res => setTime(res.data.time))
      .catch(err => console.error(err));
  }, []);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} />
      <Hero />

      {/* Render the AuthModal if showAuthModal is true */}
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}

      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Backend Time:</h1>
        <p>{time || 'Loading...'}</p>
      </div>
    </div>
  );
}

export default App;
