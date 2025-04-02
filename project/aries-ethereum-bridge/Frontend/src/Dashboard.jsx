import React from "react";
import "./Dashboard.css";
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h2>Project</h2>
                <nav>
                    <ul>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <li className="active2">Home</li>
                        </Link>                        <li>Course</li>
                        <li>Department</li>
                        <li>Year</li>
                        <li>
                            <Link to="/userinfo" style={{ textDecoration: 'none' }}>User  info</Link>
                        </li>
                    </ul>
                </nav>
                <button className="back-button">
                    <Link to="/loginInfo" style={{ textDecoration: 'none' }}>←</Link>
                </button>            </aside>
            <main className="content">
                <header>
                    <img src="profile-pic-url" alt="User" className="profile-pic" />
                </header>
                <section className="home-section">
                    <h1>Home</h1>
                    <p className="welcome">Welcome</p>
                    <div className="user-info">
                        <img
                            src="user-image-url"
                            alt="User"
                            className="user-profile-pic"
                        />
                        <h3>AKANSHA KANHAIYA GANGWANI</h3>
                        {/* <p className="registration" style={{ textAlign: "left" }}>
                            {" "}Your Registration No. : xxxxxxxxxxxxxxxxxxx<span className="eye-icon">👁️‍🗨️</span>
                        </p> */}
                    </div>
                    <div className="verified-results">
                        <h4>Verified Results/Degrees</h4>
                        <p>1. Bachelors in Technology 2025</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
