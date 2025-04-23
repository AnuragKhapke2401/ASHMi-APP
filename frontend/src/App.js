import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [time, setTime] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api`)
      .then(res => setTime(res.data.time))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Backend Time:</h1>
      <p>{time || 'Loading...'}</p>
    </div>
  );
}

export default App;
