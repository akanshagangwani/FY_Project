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

    
    <div className="login-container1">
      <div className="background1">
        <div className="circle1 top-right1"></div>
        <div className="circle1 bottom-left1"></div>
      </div>

      <div className="login-box1">
        <div className="logo1">
          {/* <img src="/logo.png" alt="Logo" className="logo-img" /> */}
          <h1 className='heading1'>Project</h1>
        </div>

        <div className="login-form1">
          <div className='login-as1'>
            <label>Login as</label>
          </div>

          <select className="dropdown1">
            <option>Select</option>
            <option>User</option>
            <option>Admin</option>
          </select>

          <button className="login-btn1" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
    
  );
};

export default LoginAs;
