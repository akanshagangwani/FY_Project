import React, { useState } from "react";
import "./Issuance.css";
import { Link } from 'react-router-dom';

const Issuance = () => {
    const [activeTab, setActiveTab] = useState("basic");

    return (
        <div className="user-info-container2">
            <aside className="sidebar2">
                <h2>Project</h2>
                <nav>
                    <ul>
                        <Link to="/"  style={{ textDecoration: 'none' }}>
                            <li className="active2">Home</li>

                        </Link>

                        <Link to="/Schema"  style={{ textDecoration: 'none' }}>
                            <li>Schema</li>
                        </Link>
                    </ul>
                </nav>
                <button className="back-button2">
                    <Link to="/Schema" style={{ textDecoration: 'none' }}>←</Link>
                </button>
            </aside>

            <main className="content2">
                <header>
                    <img src="profile-pic-url" alt="User" className="profile-pic2" />
                </header>

                <section className="user-info-section2">
                    <h1>Issuance</h1>

                    <div className="tabs2">
                        <button
                            className={activeTab === "basic" ? "active" : ""}
                            onClick={() => setActiveTab("basic")}
                        >
                            Issued
                        </button>
                        <button
                            className={activeTab === "parent" ? "active" : ""}
                            onClick={() => setActiveTab("parent")}
                        >
                            Issue New
                        </button>
                    </div>

                    <div className="info-content2">
                        {activeTab === "basic" && (
                            <div>
                                no schema issued
                            </div>
                        )}

                        {activeTab === "parent" && (
                            <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                                <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "10px" }}>
                                    Select Schema
                                </label>
                                <select style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "10px", border: "1px solid #ccc" }}>
                                    <option>Select Schema</option>
                                </select>

                                <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "10px" }}>
                                    Enter Recipient Details
                                </label>
                                <input type="text" placeholder="Recipient ID"
                                    style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                                />

                                <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "10px" }}>
                                    Attributes
                                </label>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Degree (attribute 1)</label>
                                    <input type="text" placeholder="Enter Value"
                                        style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px" }}>Name (attribute 2)</label>
                                    <input type="text" placeholder="Enter Value"
                                        style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                                    />
                                </div>
                                <button style={{ width: "100%", padding: "10px", backgroundColor: "#6a0dad", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                                    Submit
                                </button>
                            </div>
                        )}

                    </div>
                </section>
            </main>
        </div>
    );
};

export default Issuance;
