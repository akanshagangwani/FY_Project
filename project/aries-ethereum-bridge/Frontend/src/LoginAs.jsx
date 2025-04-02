import React, { useState } from 'react';
import './LoginAs.css';
import { useNavigate } from 'react-router-dom';

function LoginAs() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('');

  const handleLogin = () => {
    if (selectedUser === 'User') {
      navigate('/loginInfo');
    } else if (selectedUser === 'Admin') {
      navigate('/AdminLogin');
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div className="login-container1">
      <div className="login-wrapper">
      <div className="background1">
        <div className="circle1 top-right1"></div>
        <div className="circle1 bottom-left1"></div>
      </div>
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

          <select className="dropdown1" value={selectedUser} onChange={handleUserChange}>
            <option value="">Select</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button className="login-btn1" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginAs;