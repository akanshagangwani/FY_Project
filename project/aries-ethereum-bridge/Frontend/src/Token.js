import axios from 'axios';

const API_URL = 'http://localhost:3001';

const storeToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    storeToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const logout = () => {
  removeToken();
};

const isAuthenticated = () => {
  return getToken() !== null;
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export {
  login,
  logout,
  isAuthenticated,
  getHeaders,
  storeToken,
  getToken,
  removeToken,
};