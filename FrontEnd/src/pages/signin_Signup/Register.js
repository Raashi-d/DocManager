import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiFileText } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiFileText className="document-icon" /> 
          <h2>Create your account</h2>
          <p><span>Already have an account? </span><Link to="/login">Sign in</Link></p>
        </div>
        <form className="auth-form">
          <div className="input-group">
            <FiUser className="input-icon" />
            <input type="text" placeholder="Username" required />
          </div>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input type="email" placeholder="Email address" required />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" placeholder="Password" required />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" placeholder="Confirm Password" required />
          </div>
          <button type="submit" className="primary-button">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Register;