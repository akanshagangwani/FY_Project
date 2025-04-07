import React, { useState } from "react";
import "./Schema.css";
import { Link } from 'react-router-dom';
import ProfileButton from "./ProfileButton";

const Issuance = () => {
    const [activeTab, setActiveTab] = useState("basic");
    const [attributes, setAttributes] = useState(["", ""]);

    const addAttribute = () => {
        setAttributes([...attributes, ""]);
    };

    return (
        <div className="home-container3">
            {/* Navbar */}
            <nav className="navbar3">

                <div className="logo-section3">
                    <img
                        src="/logo.png" // Replace with actual logo
                        alt="Credex Logo"
                        className="logo3"
                    />
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span className="brand3">Credex</span>                    </Link>
                    <div className="navbar-links3">
                        <a >|</a>
                        <a href="/Schema" >Schema</a>
                        <a href="/Issuance" className="active-link">Issuance</a>
                        <a href="/Connection" >Connections</a>
                    </div>
                </div>

                <ProfileButton />
            </nav>

            {/* Main Content */}
            <div className="content-container3">
                <div className="content-box3">
                    <div className="background-overlay3"></div>
                    <h1 className="title3">Issuance</h1>
                    <div className="profile-section3">

                        <main className="content3">
                            <section className="user-info-section3">
                                <div className="tabs3">
                                    <span
                                        className={activeTab === "basic" ? "active-tab" : ""}
                                        onClick={() => setActiveTab("basic")}
                                    >
                                        Issued
                                    </span>
                                    <span
                                        className={activeTab === "parent" ? "active-tab" : ""}
                                        onClick={() => setActiveTab("parent")}
                                    >
                                        New Issue
                                    </span>
                                </div>

                                <div className="info-content3">
                                    {activeTab === "basic" && (
                                        <div>
                                            nothing issued yet
                                        </div>
                                    )}

                                    {activeTab === "parent" && (
                                        <div style={{ maxWidth: "300px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                                            <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                                                Schema Name
                                            </label>
                                            <select style={{ width: "86.5%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}>
                                                <option value="">Select Schema</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>

                                            <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                                                Attributes
                                            </label>
                                            {attributes.map((attr, index) => (
                                                <input key={index} type="text" placeholder={`Enter Attribute ${index + 1}`}
                                                    style={{ width: "80%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "0.1px solid #ccc" }}
                                                />
                                            ))}

                                            <button style={{ width: "60%", padding: "10px", backgroundColor: "#6a0dad", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
                <div className="logo-center3">
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

export default Issuance;