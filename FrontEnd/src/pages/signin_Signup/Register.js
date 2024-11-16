import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FiUser, FiMail, FiLock, FiFileText } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  // State variables for form fields and messages
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [riskyEmail, setRiskyEmail] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false); // Add errorPopup state

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setSuccessPopup(false);
      setErrorPopup(true); // Show error popup
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/signup/', {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        setMessage('User Registered Successfully');
        setSuccessPopup(true);
        setErrorPopup(false); // Hide error popup
      }
    } catch (error) {
      console.error('Error during registration:', error); // Log the error for debugging
      if (error.response) {
        if (error.response.data.message === 'Invalid or risky email address') {
          setRiskyEmail(true);
        } else {
          setMessage(error.response.data.message);
        }
      } else {
        setMessage('An error occurred. Please try again.');
      }
      setSuccessPopup(false);
      setErrorPopup(true); // Show error popup
    }
  };

  const handleSuccessPopupClose = () => {
    setSuccessPopup(false);
    navigate('/login'); // Redirect to login page after closing the success popup
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiFileText className="document-icon" />
          <h2>Create your account</h2>
          <p>
            <span>Already have an account? </span>
            <Link to="/login">Sign in</Link>
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {riskyEmail && <p className="error-message">Invalid or risky email address. Please confirm if this is correct or try again.</p>}
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-button">Create Account</button>
        </form>
        {message && <p className="message">{message}</p>}

        {/* Success Message */}
        {successPopup && (
          <div className="popup success">
            <p>{message}</p>
            <button onClick={handleSuccessPopupClose} className="popup-button">Okay</button>
          </div>
        )}

        {/* Error Message */}
        {errorPopup && (
          <div className="popup error">
            <p>{message}</p>
            <button onClick={() => setErrorPopup(false)} className="popup-button">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
