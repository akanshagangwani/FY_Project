// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      {/* ... */}
      <div className="button-container">
        <Link to="/course">
          <button className="button" id="course-button">Course</button>
        </Link>
        <Link to="/department">
          <button className="button" id="department-button">Depatment</button>
        </Link>
        <Link to="/login">
          <button className="button" id="Login-button">Login</button>
        </Link>
        {/* ... */}
      </div>
    </div>
  );
}