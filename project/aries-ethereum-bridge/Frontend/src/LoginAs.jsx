import React from 'react';
import './LoginAs.css';
import {  useNavigate } from 'react-router-dom';
import LoginPage from './Login';


function LoginAs() {

    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/loginInfo');
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
          <div className='login-as'>
            <label>Login as</label>
          </div>

          <select className="dropdown">
            <option>Select</option>
            <option>User</option>
            <option>Admin</option>
          </select>

          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
    
  );
};

export default LoginAs;
