import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [animate, setAnimate] = useState(true);
  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/sonalimkc/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log("Login Successful", data);
        navigate('/dashboard');
      } else {
        console.error("Login Failed", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimate(true);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`login-container ${animate ? 'animated' : 'initial'}`}>
      <div className="background">
        <div className={`circle top-right ${animate ? '' : 'initial'}`}></div>
        <div className={`circle bottom-left ${animate ? '' : 'initial'}`}></div>
      </div>

      <div className={`login-box ${animate ? 'animated' : 'initial'}`}>
        <div className="logo">
          <h1 className="heading">Degree Verification</h1>
        </div>

        <div className={`login-form ${animate ? 'animated' : 'initial'}`}>
          <label>Email/Login id</label>
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Login id"
          />

          <label>Password</label>
          <div className="password-input">
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
            <button
              className="password-visibility-btn"
              onClick={handlePasswordVisibility}
            >
              {passwordVisible ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>      
          <button className="login-btn" onClick={handleLogin}>Login</button>
          <Link to="/CreateAccount">
            <button className="login-btn">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;