import React, { useState } from "react";
import "./UserInfo.css";
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="user-info-container2">
      <aside className="sidebar2">
        <h2>Project</h2>
        <nav>
          <ul>
            <li className="active2">Home</li>
            <li>Information</li>
            <li>Degrees</li>
          </ul>
        </nav>
        <button className="back-button2">
          <Link to="/dashboard" style={{textDecoration:'none'}}>←</Link>
        </button>
      </aside>

      <main className="content2">
        <header>
          <img src="profile-pic-url" alt="User" className="profile-pic2" />
        </header>

        <section className="user-info-section2">
          <h1>User Information</h1>

          <div className="tabs2">
            <button
              className={activeTab === "basic" ? "active" : ""}
              onClick={() => setActiveTab("basic")}
            >
              Basic Information
            </button>
            <button
              className={activeTab === "parent" ? "active" : ""}
              onClick={() => setActiveTab("parent")}
            >
              Parent Details
            </button>
            <button
              className={activeTab === "academic" ? "active" : ""}
              onClick={() => setActiveTab("academic")}
            >
              Academic Records
            </button>
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
                <p><strong>Father's Name:</strong> KANHAIYA GANGWANI</p>
                <p><strong>Mother's Name:</strong> XYZ GANGWANI</p>
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
                <p><strong>CGPA:</strong> 8.5</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserInfo;
