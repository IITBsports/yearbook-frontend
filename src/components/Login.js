import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './p2.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://yearbook-website-1.onrender.com/api/login', { email, password });
      setError('');
      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify(response.data));
      navigate('/home');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='login-page'>
      <div className='welcome-section'>
        <img src='isc-logo.png' alt='ISC Logo' className='logo' />
        <h1>Welcome to Sports Yearbook 2025!</h1>
        <div className='carousel'>
          <img src='image1.jpg' alt='Sport 1' />
          <img src='image2.jpg' alt='Sport 2' />
          <img src='image3.jpg' alt='Sport 3' />
        </div>
      </div>
      <div className='login-section'>
        <div className='yearbook-header'>
          <img src='isc-logo.png' alt='ISC Yearbook' className='yearbook-photo' />
        </div>
        <h2>SPORTS YEARBOOK</h2>
        <p>UNTIL . VICTORY. ALWAYS</p>
        <form onSubmit={handleLogin}>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='error'>{error}</p>}
          <button type='submit' className='login-button'>Login</button>
        <button onClick={() => navigate('/register')} className='register-button'>
          New? Register Here
        </button>
        </form>
      </div>
    </div>

    // <div className='login-register'>
    //   <div class="stylish box-01">
	  //       <h2 class="effect-01">Yearbook</h2>
    //       <div className="eleven"><h1>IIT Bombay Sports Yearbook 2024</h1></div>
    //   </div>
    //   <div className="login-container">
    //     <h2>Login</h2>
    //     <form onSubmit={handleLogin}>
    //       <div className="form-group">
    //         <label htmlFor="email">Email:</label>
    //         <input
    //           type="email"
    //           id="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="form-group">
    //         <label htmlFor="password">Password:</label>
    //         <input
    //           type="password"
    //           id="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //         />
    //       </div>
    //       {error && <p className="error">{error}</p>}
    //       <button type="submit">Login</button>
    //     </form>
    //     <button onClick={() => navigate('/register')}>
    //       New? Register Here
    //     </button>
    //   </div>
    // </div>
  );
};

export default Login;