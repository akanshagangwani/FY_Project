import React, { useState, useEffect } from 'react';
import './LoginAs.css';
import { useNavigate, Link } from 'react-router-dom';

function LoginAs() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      setShowContent(true);
    }, 4000); // show logo for 2 seconds

    return () => clearTimeout(logoTimer);
  }, []);

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
      {showLogo && (
        <div className="logo-fade-screen">
          <img src="/logo.png" alt="Logo" className="fade-logo" />
        </div>
      )}

      {showContent && (
        <>
          <div className="login-wrapper">
            <div className="background1">
              <div className="circle1 top-right1"></div>
              <div className="circle1 bottom-left1"></div>
            </div>
          </div>

          <div className="login-box1">
            <div className="logo1">
              <img src="/logo.png" alt="Logo" className="Mainlogo" />
              <h1 className="heading1">Credex</h1>
            </div>

            <div className="login-form1">
              <div className="login-as1">
                <label className="las">Login as</label>
              </div>

              <select className="dropdown1" value={selectedUser} onChange={handleUserChange}>
                <option value="">Select</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              <button className="login-btn1" onClick={handleLogin}>Login</button>
              <p>Don't have an account? <Link to="/CreateAccount">create account</Link></p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LoginAs;
