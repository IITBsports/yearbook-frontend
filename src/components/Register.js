import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [emailVerified, setEmailVerified] = useState(false);
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
        setEmailVerified(true);
        setCurrentStep(3);
        setError('');
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
      setCurrentStep(4);
      // Redirect to login page after 3 seconds
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.log('Error response:', error.response);
      setError('Error registering user');
      setSuccess('');
    }
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className='register-page'>
      <div className='welcome-section'>
        <img src='isc-logo.png' alt='ISC Logo' className='logo' />
        <h1>Welcome to Sports Yearbook 2025!</h1>
        <div className='carousel'>
          <img src='image1.jpg' alt='Sport 1' />
          <img src='image2.jpg' alt='Sport 2' />
          <img src='image3.jpg' alt='Sport 3' />
        </div>
      </div>
      
      <div className='register-section'>
        
        {/* Registration Steps Guide */}
        <div className='registration-steps'>
          <h3>Registration Process:</h3>
          <div className='steps-container'>
            <div className={`step ${getStepStatus(1)}`}>
              <div className='step-number'>1</div>
              <div className='step-content'>
                <h4>Email Verification</h4>
                <p>Click on "Sign in with email" and enter your LDAP email (@iitb.ac.in)</p>
              </div>
            </div>
            
            <div className={`step ${getStepStatus(2)}`}>
              <div className='step-number'>2</div>
              <div className='step-content'>
                <h4>Enter OTP</h4>
                <p>You will receive an OTP. Enter it to verify your email address</p>
              </div>
            </div>
            
            <div className={`step ${getStepStatus(3)}`}>
              <div className='step-number'>3</div>
              <div className='step-content'>
                <h4>Complete Registration</h4>
                <p>After email verification, enter your name and create a password</p>
              </div>
            </div>
            
            <div className={`step ${getStepStatus(4)}`}>
              <div className='step-number'>4</div>
              <div className='step-content'>
                <h4>Ready to Login</h4>
                <p>Use your registered email and password for future logins</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} autoComplete="off">
          {/* Step 1 & 2: Email Verification */}
          {!emailVerified && (
            <div className='verification-section'>
              <h4>Step 1: Verify Your Email</h4>
              <p className='instruction-text'>
                Click the button below and enter your LDAP email address (@iitb.ac.in)
              </p>
              <div className="pe_verify_email" data-client-id="15525971141294700440"></div>
            </div>
          )}

          {/* Step 3: Name and Password (shown after email verification) */}
          {emailVerified && (
            <div className='details-section'>
              <h4>Step 3: Complete Your Registration</h4>
              <div className='form-group'>
                <label htmlFor='email'>Verified Email:</label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled
                  className='verified-email'
                />
                <span className='verification-badge'>✓ Verified</span>
              </div>
              
              <div className='form-group'>
                <label htmlFor='name'>Name:</label>
                <input
                  type='text'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter your full name'
                  required
                />
              </div>
              
              <div className='form-group'>
                <label htmlFor='password'>Password:</label>
                <input
                  type='password'
                  id='password'
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Create a secure password'
                  required
                />
                <div className='password-reminder'>
                  <span className='reminder-icon'>💡</span>
                  <span className='reminder-text'>Please save your password for future use</span>
                </div>
              </div>
              
              <button type='submit' className='register-button'>
                Complete Registration
              </button>
            </div>
          )}

          {error && <p className='error'>{error}</p>}
          {success && <p className='success'>{success}</p>}
          
          <div className='additional-options'>
            <button 
              type='button'
              onClick={() => navigate('/alumni-register')} 
              className='alumni-register-button'
            >
              Register as Alumni
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .registration-steps {
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          font-size:0.7rem;
        }
        
        .registration-steps h3 {
          margin-top: 0;
          margin-bottom: 0.4rem;
          color: #333;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .step {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.4rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .step.completed {
          background: #d4edda;
          border: 1px solid #c3e6cb;
        }
        
        .step.active {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .step.pending {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          opacity: 0.7;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          flex-shrink: 0;
        }
        
        .step.completed .step-number {
          background: #28a745;
          color: white;
        }
        
        .step.active .step-number {
          background: #ffc107;
          color: #212529;
        }
        
        .step.pending .step-number {
          background: #6c757d;
          color: white;
        }
        
        .step-content h4 {
          margin: 0 0 0.5rem 0;
        }
        
        .step-content p {
          margin: 0;
          color: #666;
        }
        
        .verification-section,
        .details-section {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          font-size:0.8rem;
        }
        
        .verification-section h4,
        .details-section h4 {
          margin-top: 0;
          color: #007bff;
        }
        
        .instruction-text {
          color: #666;
          margin-bottom: 1rem;
          font-style: italic;
        }
        
        .verified-email {
          background: #e8f5e8 !important;
        }
        
        .verification-badge {
          color: #28a745;
          font-weight: bold;
          margin-left: 0.5rem;
        }
        
        .password-reminder {
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .reminder-icon {
          margin-right: 0.5rem;
          font-size: 1rem;
        }
        
        .reminder-text {
          color: #856404;
          font-weight: 500;
        }
        
        .additional-options {
          border-top: 1px solid #eee;
          text-align: center;
        }
        
        .form-group {
          position: relative;
        }
        
        @media (max-width: 768px) {
          .registration-steps {
            margin: 0.5rem 0;
            padding: 0.4rem;
            font-size:0.8rem;
          }
          
          .step {
            padding: 0.3rem;
          }
          
          .step-number {
            width: 18px;
            height: 18px;
            font-size: 9px;
          }
          
          .step-content h4 {
            font-size: 0.55rem;
          }
          
          .step-content p {
            font-size: 0.45rem;
          }
          
          .password-reminder {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .reminder-icon {
            margin-right: 0;
          }  
        
        .details-section {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          font-size:0.6rem;
        }
        
        }
        @media (max-width: 400px) {
        .verification-section,
        .details-section {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          font-size:0.7rem
        }
        .reminder-text {
          color: #856404;
          font-weight: 500;
          font-size:0.4rem;
        }
        }
      `}</style>
    </div>
  );
};

export default Register;