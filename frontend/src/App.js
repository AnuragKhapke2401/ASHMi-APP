import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

function App() {
  const [time, setTime] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api`)
      .then(res => setTime(res.data.time))
      .catch(err => console.error(err));
  }, []);

  const handleLoginClick = () => {
    alert('Login button clicked!');
  };

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} />
      <Hero />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Backend Time:</h1>
        <p>{time || 'Loading...'}</p>
      </div>
    </div>
  );
}

export default App;
