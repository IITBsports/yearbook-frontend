import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load the email verification script
    const script = document.createElement('script');
    script.src = 'https://www.phone.email/verify_email_v1.js';
    script.async = true;
    document.body.appendChild(script);

    // Define the callback function
    window.phoneEmailReceiver = async (userObj) => {
      try {
        const user_json_url = userObj.user_json_url;
        
        // Fetch the email from the JSON file
        const response = await axios.get(user_json_url);
        const verifiedEmail = response.data.user_email_id;
        
        // Set the email state with the verified email
        setEmail(verifiedEmail);
        setSuccess('Email verified successfully');
      } catch (error) {
        setError('Error fetching verified email');
      }
    };

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register button clicked');
    console.log('Email:', email);

    if (!email.endsWith('@iitb.ac.in')) {
      setError('Email must be in the format __@iitb.ac.in');
      return;
    }
    try {
      console.log('Sending request to server');
      const response = await axios.post('https://yearbook-website-1.onrender.com/api/register', { name, email, password });
      setSuccess(response.data.message);
      setError('');
      // Redirect to login page after 2 seconds
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.log('Error response:', error.response);
      setError('Error registering user');
      setSuccess('');
    }
  };

  return (
    <div className='register-page'>
      <div className='welcome-section'>
        <img src='isc-logo.png' alt='ISC Logo' className='logo' />
        <h1>Welcome to ISC Yearbook 2024!</h1>
        <div className='carousel'>
          <img src='image1.jpg' alt='Sport 1' />
          <img src='image2.jpg' alt='Sport 2' />
          <img src='image3.jpg' alt='Sport 3' />
        </div>
      </div>
      <div className='register-section'>
        <h2>Register</h2>
        <form onSubmit={handleRegister} autocomplete="off">
          <div className="pe_verify_email" data-client-id="15525971141294700440"></div>
          <div className='form-group'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password' >Password:</label>
            <input
              type='password'
              id='password'
              autocomplete="defaultpassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='error'>{error}</p>}
          {success && <p className='success'>{success}</p>}
          
          <button type='submit' className='register-button'>Register</button>
          <button onClick={() => navigate('/alumni-register')} className='alumni-register-button'>
            Register as Alumni
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
