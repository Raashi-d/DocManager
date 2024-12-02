import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUpload, FiLogOut } from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="top-menu">
        <h2>DocManager</h2>
        <div className="user-info">
          <h3>User name</h3>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search documents..." />
          </div>
          <div className="dashboard-actions">
            <label htmlFor="file-upload" className="action-button">
              <FiUpload /> Upload
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <div className="content">
          <section className="documents">
            <h3>Documents</h3>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="document-item">
                  {file.name}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
