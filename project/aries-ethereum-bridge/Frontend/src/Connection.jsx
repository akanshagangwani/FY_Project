import React, { useState } from "react";
import "./Connections.css";
import { Link } from 'react-router-dom';
import ProfileButton from "./ProfileButton";

const Connection = () => {
    const [activeTab, setActiveTab] = useState("basic");
    const [newTab, setNewTab] = useState("create");
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
                        <a href="/Issuance" >Issuance</a>
                        <a href="/Connection" className="active-link">Connections</a>
                    </div>
                </div>

                <ProfileButton />
            </nav>

            {/* Main Content */}
            <div className="content-container3">
                <div className="content-box3">
                    <div className="background-overlay3"></div>
                    <h1 className="title3">Connections</h1>
                    <div className="profile-section3">

                        <main className="content3">
                            <section className="user-info-section3">
                                <div className="tabs3">
                                    <span
                                        className={activeTab === "basic" ? "active-tab" : ""}
                                        onClick={() => setActiveTab("basic")}
                                    >
                                        Active
                                    </span>
                                    <span
                                        className={activeTab === "parent" ? "active-tab" : ""}
                                        onClick={() => setActiveTab("parent")}
                                    >
                                        New
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
                                            <div className="tabs3">
                                                <span
                                                    className={newTab === "create" ? "active-tab" : ""}
                                                    onClick={() => setNewTab("create")}
                                                >
                                                    Create Invitation
                                                </span>
                                                <span
                                                    className={newTab === "issue" ? "active-tab" : ""}
                                                    onClick={() => setNewTab("issue")}
                                                >
                                                    Accept invitation
                                                </span>
                                            </div>

                                            {newTab === "create" && (
                                                <div>
                                                    <div style={{ width: "300px", height: "150px", padding: "10px", backgroundColor: "#E8D8FF", color: "Black", border: "none", borderRadius: "15px", cursor: "pointer", marginTop: "50px", textAlign: "center", paddingTop: "25px" }}>
                                                        Send invitation
                                                        <input
                                                            type="email"
                                                            placeholder="Enter Email ID"
                                                            style={{
                                                                marginTop: "10%",
                                                                width: "70%",
                                                                height: "10px",
                                                                padding: "10px",
                                                                backgroundColor: "#fff",
                                                                color: "black",
                                                                border: "none",
                                                                borderRadius: "5px"
                                                            }}
                                                        />
                                                        <button
                                                            type="submit"
                                                            style={{
                                                                marginTop: "20px",
                                                                width: "30%",
                                                                height: "30px",
                                                                padding: "10px",
                                                                backgroundColor: "#993dfd ",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "5px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            Submit
                                                        </button>

                                                    </div>
                                                </div>
                                            )}

                                            {newTab === "issue" && (
                                                <div>
                                                    <div style={{ width: "300px", height: "150px", padding: "10px", backgroundColor: "#E8D8FF", color: "Black", border: "none", borderRadius: "15px", cursor: "pointer", marginTop: "50px", textAlign: "center", paddingTop: "25px" }}>
                                                        Accept invitation
                                                        <input
                                                            type="text"

                                                            placeholder="Invitation Link"
                                                            style={{
                                                                marginTop: "10%",
                                                                width: "70%",
                                                                height: "10px",
                                                                padding: "10px",
                                                                backgroundColor: "#fff",
                                                                color: "black",
                                                                border: "none",
                                                                borderRadius: "5px"
                                                            }}
                                                        />
                                                        <button
                                                            type="submit"
                                                            style={{
                                                                marginTop: "20px",
                                                                width: "30%",
                                                                height: "30px",
                                                                padding: "10px",
                                                                backgroundColor: "#993dfd ",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "5px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            Submit
                                                        </button>

                                                    </div>
                                                </div>
                                            )}
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

export default Connection;