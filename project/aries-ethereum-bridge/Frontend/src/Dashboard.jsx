import React from "react";
import "./Dashboard.css";
import ProfileButton from "./ProfileButton";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-section">
          <img
            src="/logo.png"
            alt="Credex Logo"
            className="logo1"
          />
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="brand">Credex</span>
          </Link>
          <a>|</a>
          <div className="nav-links">
            <a href="/dashboard" className="active-link">
              Home
            </a>
            <a href="/UserInfo">Information</a>
            <a href="#">Certificates</a>
          </div>
        </div>

        <ProfileButton />
      </nav>

      {/* Main Content */}
      <div className="content-container">
        <div className="content-box">
          <div className="background-overlay"></div>
          <h1 className="title">Home</h1>
          <p className="welcome">Welcome</p>
          <div className="profile-section">
            <img
              src="/gangwani.png" // Replace with actual profile image
              alt="User  Profile"
              className="profile-pic"
            />
            <span className="profile-name">AKANSHA KANHAIYA GANGWANI</span>
            <br></br>
            <br></br>
          </div>
          <p className="registration">
            Your Registration No.: <span className="reg-number">xxxxxxxxxxxxxxxx</span>
          </p>
          <p className="degree-title">Verified Results/Degrees</p>
          <p className="degree-info">1. Bachelors in Technology 2025</p>
        </div>
        <div className="logo-center">
          <img
            src="/Halflogo.png" // Replace with actual logo
            alt="Credex Logo"
            className="Centerlogo"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;