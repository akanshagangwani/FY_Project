import React, { useState } from 'react';
import './Login.css';
function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="login-container">
      <div className="background">
        <div className="circle top-right"></div>
        <div className="circle bottom-left"></div>
      </div>

      <div className="login-box">
        <div className="logo">
          {/* <img src="/logo.png" alt="Logo" className="logo-img" /> */}
          <h1 className='heading'>Project</h1>
        </div>

        <div className="login-form">
          {/* <div className='login-as'>
            <label>Login as</label>
          </div>

          <select className="dropdown">
            <option>Select</option>
            <option>User</option>
            <option>Admin</option>
          </select> */}

          <label>Email/Login id</label>
          <input type="text" placeholder="Login id" />

          <label>Password</label>
          <div className="password-input">
            <input
              type={passwordVisible ? 'text' : 'password'}
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

          <button className="login-btn">Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
