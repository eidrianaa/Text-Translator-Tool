import React from 'react';
import SignupForm from './SignupForm.js';
import './Register.css'; // Import the CSS file

const Register = () => {
  return (
    <div className="lr-container"> {/* Wrap your content in the container div */}
      <div className="register-container"> {/* Apply register-container class */}
        <h2>Register</h2>
        <SignupForm />
      </div>
    </div>
  );
}

export default Register;
