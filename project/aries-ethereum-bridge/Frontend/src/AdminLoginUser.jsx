import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

function AdminLoginUser() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [animate, setAnimate] = useState(true);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimate(true);
    }, 0); // delay for 0 seconds
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
          {/* <img src="/logo.png" alt="Logo" className="logo-img" /> */}
          <h1 className="heading">Credex</h1>
        </div>

        <div className={`login-form ${animate ? 'animated' : 'initial'}`}>
          <label>Email/Login id</label>
          <input type="text" placeholder=" Admin Login id" />

          <label>Password</label>
          <div className="password-input">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Admin Password"
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

          <Link to="/Schema">
            <button className="login-btn">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginUser;