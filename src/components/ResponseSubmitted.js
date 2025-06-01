// components/ResponseSubmitted.js
import React from 'react';
import { Link } from 'react-router-dom';

const ResponseSubmitted = () => {
  return (
    <div className="response-submitted-page">
      <div className="response-submitted-left">
        <h2>Sports YEARBOOK</h2>
        <h3>Thank You!</h3>
        <p>Your response has been submitted successfully.</p>
      </div>
      <div className="response-submitted-right">
        <Link to="/fill-memory">
          <button>Submit Another Response</button>
        </Link>
      </div>
    </div>
  );
};

export default ResponseSubmitted;
