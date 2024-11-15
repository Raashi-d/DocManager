import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create your account</h2>
          <p><Link to="/login">Already have an account? Sign in</Link></p>
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
