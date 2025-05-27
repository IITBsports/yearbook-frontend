//src/components/HomePage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
    }
  }, []);

  return (
    <div className='home-page'>
      <div className='welcome-section'>
        <img src='isc-logo.png' alt='ISC Logo' className='logo' />
        <h2>Name: {name} </h2>
        <h2>Email: {email}</h2>
        <h1>Welcome to ISC Yearbook 2024!</h1>
        <div className='carousel'>
          <img src='image1.jpg' alt='Sport 1' />
          <img src='image2.jpg' alt='Sport 2' />
          <img src='image3.jpg' alt='Sport 3' />
        </div>
      </div>
      <div className='fill-memory'>
        <h2>Contribute to the Yearbook</h2>
        <p>Share your memories, photos, and videos with the graduating seniors. Your contributions will help make the yearbook a enduring recollections for everyone.</p>
        <Link to="/fill-memory">
          <button className='memory-button'>Fill a Memory</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;




