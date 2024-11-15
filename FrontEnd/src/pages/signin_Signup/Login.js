import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiFileText } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiFileText className="document-icon" /> 
          <h2>Sign in to <span>DocManager</span></h2>
          <p> <span>Or</span><Link to="/register"> create a new account</Link></p>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input type="text" placeholder="Username" required />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" placeholder="Password" required />
          </div>
          <p><Link to="/forgot-password">Forgot your password?</Link></p>
          <button type="submit" className="primary-button">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;