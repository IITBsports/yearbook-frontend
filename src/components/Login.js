import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './p2.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResetSection, setShowResetSection] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: email verification, 2: token verification, 3: password reset
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load the email verification script when showing reset section
    if (showResetSection && !emailVerified) {
      const script = document.createElement('script');
      script.src = 'https://www.phone.email/verify_email_v1.js';
      script.async = true;
      document.body.appendChild(script);

      // Define the callback function for email verification
      window.phoneEmailReceiver = async (userObj) => {
        try {
          const user_json_url = userObj.user_json_url;
          
          // Fetch the email from the JSON file
          const response = await axios.get(user_json_url);
          const verifiedEmail = response.data.user_email_id;
          
          if (!verifiedEmail.endsWith('@iitb.ac.in')) {
            setError('Only @iitb.ac.in emails are allowed');
            return;
          }
          
          // Set the email state with the verified email and request reset token
          setResetEmail(verifiedEmail);
          setEmailVerified(true);
          handleForgotPassword(verifiedEmail);
        } catch (error) {
          setError('Error fetching verified email');
        }
      };

      // Clean up the script when the component unmounts or reset section is hidden
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [showResetSection, emailVerified]);

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

  const handleShowResetSection = () => {
    setShowResetSection(true);
    setResetStep(1);
    setError('');
    setSuccess('');
    setEmailVerified(false);
    setResetEmail('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post('https://yearbook-website-1.onrender.com/api/forgot-password', { 
        email: email || resetEmail 
      });
      setResetToken(response.data.resetToken);
      setSuccess('Reset token generated successfully');
      setError('');
      setResetStep(2);
    } catch (error) {
      setError(error.response?.data?.error || 'Error generating reset token');
      setSuccess('');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    try {
      const response = await axios.post('https://yearbook-website-1.onrender.com/api/reset-password', {
        email: resetEmail,
        resetToken: resetToken,
        newPassword: newPassword
      });
      
      setSuccess('Password reset successfully! You can now login with your new password.');
      setError('');
      
      // Close reset section after 3 seconds and clear form
      setTimeout(() => {
        setShowResetSection(false);
        setResetStep(1);
        setEmailVerified(false);
        setResetEmail('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Error resetting password');
      setSuccess('');
    }
  };

  const handleCancelReset = () => {
    setShowResetSection(false);
    setResetStep(1);
    setEmailVerified(false);
    setResetEmail('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
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
          <img src='logo-3.png' alt='ISC Yearbook' className='yearbook-photo' />
        </div>
        <h2>SPORTS YEARBOOK</h2>
        <p>UNTIL . VICTORY. ALWAYS</p>
        
        {!showResetSection ? (
          // Regular Login Form
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
            {success && <p className='success'>{success}</p>}
            <button type='submit' className='login-button'>Login</button>
            <button type='button' onClick={() => navigate('/register')} className='register-button'>
              New? Register Here
            </button>
            <button type='button' onClick={handleShowResetSection} className='reset-button'>
              Reset Password
            </button>
          </form>
        ) : (
          // Password Reset Section
          <div className='reset-password-section'>
            <h3>Reset Password</h3>
            
            {/* Step 1: Email Verification */}
            {resetStep === 1 && !emailVerified && (
              <div className='verification-section'>
                <h4>Step 1: Verify Your Email</h4>
                <p className='instruction-text'>
                  Click the button below and enter your LDAP email address (@iitb.ac.in)
                </p>
                <div className="pe_verify_email" data-client-id="15525971141294700440"></div>
              </div>
            )}

            {/* Step 2: Show Reset Token (Auto-generated after email verification) */}
            {resetStep === 2 && emailVerified && (
              <div className='token-section'>
                <h4>Step 2: Reset Token Generated</h4>
                <div className='form-group'>
                  <label htmlFor='resetEmail'>Verified Email:</label>
                  <input
                    type='email'
                    id='resetEmail'
                    value={resetEmail}
                    disabled
                    className='verified-email'
                  />
                  <span className='verification-badge'>✓ Verified</span>
                </div>
                <div className='form-group'>
                  <label htmlFor='resetToken'>Reset Token:</label>
                  <input
                    type='text'
                    id='resetToken'
                    value={resetToken}
                    disabled
                    className='reset-token'
                  />
                </div>
                <button 
                  type='button' 
                  onClick={() => setResetStep(3)} 
                  className='continue-button'
                >
                  Continue to Reset Password
                </button>
              </div>
            )}

            {/* Step 3: Enter New Password */}
            {resetStep === 3 && (
              <form onSubmit={handleResetPassword} className='password-reset-form'>
                <h4>Step 3: Set New Password</h4>
                <div className='form-group'>
                  <label htmlFor='newPassword'>New Password:</label>
                  <input
                    type='password'
                    id='newPassword'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Enter new password (min 4 characters)'
                    required
                    minLength={4}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='confirmPassword'>Confirm New Password:</label>
                  <input
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm your new password'
                    required
                    minLength={4}
                  />
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className='error'>Passwords do not match</p>
                )}
                <button type='submit' className='reset-submit-button'>
                  Reset Password
                </button>
              </form>
            )}

            {error && <p className='error'>{error}</p>}
            {success && <p className='success'>{success}</p>}
            
            <button type='button' onClick={handleCancelReset} className='cancel-reset-button'>
              Cancel / Back to Login
            </button>
          </div>
        )}
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