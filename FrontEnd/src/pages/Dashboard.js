import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFolderPlus, FiUpload, FiLogOut } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleNewFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      setFolders([...folders, folderName]);
    }
  };

  const handleLoguot = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>DocManager</h2>
        <button className="logout-button" onClick={handleLoguot}><FiLogOut /> Logout</button>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
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
                style={{ display: 'none' }}
              />
            </label>
            <button className="action-button" onClick={handleNewFolder}>
              <FiFolderPlus /> New Folder
            </button>
          </div>
        </header>
        <div className="content">
          <section className="folders">
            <h3>Folders</h3>
            <ul>
              {folders.map((folder, index) => (
                <li key={index} className="folder-item">{folder}</li>
              ))}
            </ul>
          </section>
          <section className="documents">
            <h3>Documents</h3>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="document-item">{file.name}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
