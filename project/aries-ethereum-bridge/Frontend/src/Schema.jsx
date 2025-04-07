import React, { useState, useEffect } from 'react';
import "./Schema.css";
import { Link } from 'react-router-dom';
import ProfileButton from "./ProfileButton";

const Schema = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [attributes, setAttributes] = useState(["", ""]);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [schemaName, setSchemaName] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/credex/academic/list-schemas?username=admin1')
      .then(response => response.json())
      .then(data => setSchemas(data.labels));
  }, []);

  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  const handleSchemaChange = (event) => {
    setSelectedSchema(event.target.value);
  };

  const handleSchemaNameChange = (event) => {
    setSchemaName(event.target.value);
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
            <span className="brand3">Credex</span>
          </Link>
          <div className="navbar-links3">
            <a >|</a>
            <a href="/Schema" className="active-link">Schema</a>
            <a href="/Issuance">Issuance</a>
            <a href="/Connection">Connections</a>
          </div>
        </div>

        <ProfileButton />
      </nav>

      {/* Main Content */}
      <div className="content-container3">
        <div className="content-box3">
          <div className="background-overlay3"></div>
          <h1 className="title3">Schema</h1>
          <div className="profile-section3">

            <main className="content3">
              <section className="user-info-section3">
                <div className="tabs3">
                  <span
                    className={activeTab === "basic" ? "active-tab" : ""}
                    onClick={() => setActiveTab("basic")}
                  >
                    Existing Schema
                  </span>

                  <span
                    className={activeTab === "parent" ? "active-tab" : ""}
                    onClick={() => setActiveTab("parent")}
                  >
                    New Schema
                  </span>
                </div>

                <div className="info-content3">
                  {activeTab === "basic" && (
                    <div>
                      No Exisiting Schema
                    </div>
                  )}

                  {activeTab === "parent" && (
                    <div style={{ maxWidth: "300px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                      <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                        Select Schema
                      </label>
                      <select style={{ width: "86.5%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                        value={selectedSchema} onChange={handleSchemaChange}>
                        <option value="">Select Schema</option>
                        {schemas.map((schema, index) => (
                          <option key={index} value={schema}>{schema}</option>
                        ))}
                      </select>
                      <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                        Schema Name
                      </label>
                      <input type="text" placeholder="Enter Schema name"
                        style={{ width: "80%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                        value={schemaName} onChange={handleSchemaNameChange} />

                      <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                        Attributes
                      </label>
                      {attributes.map((attr, index) => (
                        <input key={index} type="text" placeholder={`Enter Attribute ${index + 1}`}
                          style={{ width: "80%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "0.1px solid #ccc" }}
                        />
                      ))}

                      <button onClick={addAttribute} style={{ width: "60%", padding: "10px", backgroundColor: "#6a0dad", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "10px" }}>
                        + Add Attribute
                      </button>
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

export default Schema;