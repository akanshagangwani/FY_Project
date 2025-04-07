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

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    const headers = getHeaders();
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/credex/academic/list-schemas?username=admin1', {
        method: 'GET',
        headers: headers
      });
      const data = await response.json();
      console.log(data); // Verify the data is being retrieved correctly
      console.log(data.labels); // Verify the data is being retrieved correctly
      setSchemas(data.labels);
    };
    fetchData();
  }, []);

  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  const handleSchemaChange = (event) => {
    const selectedSchema = event.target.value;
    fetchApi(selectedSchema);
    setSelectedSchema(selectedSchema);
  };

  const handleAttributeChange = (event, index) => {
    const newAttributes = [...attributes];
    newAttributes[index] = event.target.value;
    setAttributes(newAttributes);
  };

  const attributesList = [
    "Student Name",
    "Student Id",
    "Degree",
    "Graduation Date",
    "Institution",
    "Courses",
    "GPA",  
  ];
  
  
  const fetchApi = (schema) => {
    const username = localStorage.getItem('username');

    fetch(`http://localhost:3001/credex/academic/get-schema?username=${username}&label=${schema}`)
    .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
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
                  </span>
                </div>

                <div className="info-content3">
                  {activeTab === "parent" && (
                    <div>
                    </div>
                  )}

                  {activeTab === "basic" && (
                    <div style={{ maxWidth: "300px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                      <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                        Select Schema
                      </label>
                      <select style={{ width: "86.5%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                        value={selectedSchema} onChange={handleSchemaChange}>
                        <option value="">Select Schema</option>
                        {schemas && schemas.map((schema, index) => (
                          <option key={index} value={schema}>{schema}</option>
                        ))}
                      </select>
                      <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
                        Schema Name
                      </label>
                      <input
      type="text"
      placeholder="Enter Schema name"
      style={{
        width: "80%",
        padding: "8px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
      value={schemaName}
      onChange={handleSchemaNameChange}
    />
    {attributesList.map((attribute, index) => (
      <div key={index}>
        <label style={{ fontWeight: "bold", color: "#6a0dad", display: "block", marginBottom: "5px" }}>
          {attribute}
        </label>
        <input
          type="text"
          placeholder={`Enter ${attribute}`}
          style={{
            width: "80%",
            padding: "8px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          value={attributes[index]}
          onChange={(event) => handleAttributeChange(event, index)}
        />
      </div>
    ))}                 

                      <button style={{ width: "60%", padding: "10px", backgroundColor: "#6a0dad", color: "white", border: "none", borderRadius: "5px", cursor: "pointer",marginTop:"20px" }}>
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