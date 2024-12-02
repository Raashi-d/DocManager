import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiLock, FiFileText } from 'react-icons/fi';
import './Auth.css';

const Login = () => {

  // State for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try{
      // send post req
      const response = await axios.post('http://localhost:5000/api/user/signin/', 
        {email,password}
      )

      if (response.status === 200) {
        const { token, user } = response.data;

        //save a JWT token, user name, and user ID in local for future use
        localStorage.setItem('token', token);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userId', user._id);

        navigate('/dashboard');
      }

      

    } catch(error){

      if(error.response){
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
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
            <input 
              type="email" 
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Enter Your Password" 
              value={password}
              onChange={ (e) => setPassword(e.target.value)
              }
              required />
          </div>
          <p><Link to="/forgot-password">Forgot your password?</Link></p>
          <button type="submit" className="primary-button">Sign in</button>
        </form>
        {/* Display Error Message if login fails */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;