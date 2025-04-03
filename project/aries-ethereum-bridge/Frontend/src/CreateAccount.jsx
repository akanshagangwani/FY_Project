import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CreateAccount() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    console.log("Username:", formData.username);
    console.log("Email:", formData.email);
    console.log("Password:", formData.password);

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/sonalimkc/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }
      setSuccess('Account created successfully!');
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="background">
        <div className="circle top-right"></div>
        <div className="circle bottom-left"></div>
      </div>

      <div className="login-box">
        <div className="logo">
          <h1 className="heading">Credex</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          <label>Username</label>
          <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleInputChange} required />
          
          <label>Email/Login ID</label>
          <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} required />

          <label>Password</label>
          <div className="password-input">
            <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} required />
            <button type="button" className="password-visibility-btn" onClick={handlePasswordVisibility}>
              {passwordVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default CreateAccount;