import React, { useState } from "react";
import "./Schema.css";
import { Link } from 'react-router-dom';

const Schema = () => {
    const [activeTab, setActiveTab] = useState("basic");
    const [attributes, setAttributes] = useState(["", ""]);

    const addAttribute = () => {
        setAttributes([...attributes, ""]);
    };

    return (
        <div className="user-info-container2">
            <aside className="sidebar2" >
                <h2>Project</h2>
                <nav>
                    <ul>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <li className="active2">Home</li>
                        </Link>
                        <Link to="/Issuance" style={{ textDecoration: 'none' }}>
                            <li>Issuance</li>
                        </Link>
                    </ul>
                </nav>
                <button className="back-button2">
                    <Link to="/AdminLogin" style={{ textDecoration: 'none' }}>←</Link>
                </button>
            </aside>

            <main className="content2">
                <header>
                    <img src="profile-pic-url" alt="User" className="profile-pic2" />
                </header>

                <section className="user-info-section2">
                    <h1>Schema</h1>

                    <div className="tabs2">
                        <button
                            className={activeTab === "basic" ? "active" : ""}
                            onClick={() => setActiveTab("basic")}
                        >
                            Exisitng Schema
                        </button>
                        <button
                            className={activeTab === "parent" ? "active" : ""}
                            onClick={() => setActiveTab("parent")}
                        >
                            New Schema
                        </button>

                    </div>

                    <div className="info-content2">
                        {activeTab === "basic" && (
                            <div>
                                No Exisiting Schema (bund marao)
                            </div>
                        )}

                        {activeTab === "parent" && (
                            <div style={{ maxWidth: "300px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                                <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                                    Schema Name
                                </label>
                                <input type="text" placeholder="Enter Schema name"
                                    style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                                />

                                <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                                    Attributes
                                </label>
                                {attributes.map((attr, index) => (
                                    <input key={index} type="text" placeholder={`Enter Attribute ${index + 1}`}
                                        style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                                    />
                                ))}

                                <button onClick={addAttribute} style={{ width: "100%", padding: "10px", backgroundColor: "#6a0dad", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "10px" }}>
                                    + Add Attribute
                                </button>
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

export default Schema;
