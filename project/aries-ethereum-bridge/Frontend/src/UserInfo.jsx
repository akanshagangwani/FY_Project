import React, { useState } from "react";
import "./UserInfo.css";
import { Link } from 'react-router-dom';
import ProfileButton from "./ProfileButton";


const UserInfo = () => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="home-container2">
      {/* Navbar */}
      <nav className="navbar2">
        <div className="logo-section2">
          <img
            src="/logo.png" // Replace with actual logo
            alt="Credex Logo"
            className="logo2"
          />
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="brand">Credex</span>
          </Link>
          <a>|</a>
          <div className="nav-links2">
          <a href="/dashboard" >Home</a>
          <a href="/UserInfo" className="active-link">Information</a>
          <a href="#">Certificates</a>
        </div>
        </div>
        
        <ProfileButton/>
      </nav>

      {/* Main Content */}
      <div className="content-container2">
        <div className="content-box2">
          <div className="background-overlay2"></div>
          <h1 className="title2">User  Information</h1>
          <div className="profile-section2">
            <br></br>
          </div>
          <div className="tab-container">
            <div
              className={activeTab === "basic" ? "tab active" : "tab"}
              onClick={() => setActiveTab("basic")}
            >
              Basic Information
            </div>
            <div
              className={activeTab === "parent" ? "tab active" : "tab"}
              onClick={() => setActiveTab("parent")}
            >
              Parent Details
            </div>
            <div
              className={activeTab === "academic" ? "tab active" : "tab"}
              onClick={() => setActiveTab("academic")}
            >
              Academic Records
            </div>
          </div>
          <div className="info-content2">
            {activeTab === "basic" && (
              <div>
                <p><strong>Display Name:</strong> AKANSHA KANHAIYA GANGWANI</p>
                <p><strong>Marital Status:</strong> Unmarried</p>
                <p><strong>Gender:</strong> Female</p>
                <p><strong>Date of Birth:</strong> 25/02/2003</p>
                <p><strong>Email:</strong> akanshagangwani555@gmail.com</p>
                <p><strong>Mobile:</strong> 7020007677</p>
                <p><strong>Nationality:</strong> Indian</p>
              </div>
            )}

            {activeTab === "parent" && (
              <div>
                <p><strong>Father's Name:</strong> Kanhaiya Gangwani</p>
                <p><strong>Mother's Name:</strong> Roma Gangwani</p>
                <p><strong>Father's Occupation:</strong> Business</p>
                <p><strong>Mother's Occupation:</strong> Homemaker</p>
                <p><strong>Contact:</strong> 9876543210</p>
              </div>
            )}

            {activeTab === "academic" && (
              <div>
                <p><strong>University Enrollment No.:</strong> 2021106600975507</p>
                <p><strong>Degree:</strong> Bachelors in Technology</p>
                <p><strong>Passing Year:</strong> 2025</p>
                <p><strong>CGPA:</strong> 9.25</p>
              </div>
            )}
          </div>
        </div>
        <div className="logo-center2">
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

export default UserInfo;