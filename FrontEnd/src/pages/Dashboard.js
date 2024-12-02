import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUpload, FiLogOut, FiX } from "react-icons/fi";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/${userId}`
      );
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      setUploadStatus("success");
      fetchFiles(); // Fetch files again to update the list
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const closePopup = () => {
    setUploadStatus(null);
  };

  const truncateFileName = (fileName) => {
    const maxLength = 20;
    if (fileName.length > maxLength) {
      return fileName.substring(0, maxLength) + "...";
    }
    return fileName;
  };

  const openFileModal = (file) => {
    setSelectedFile(file);
  };

  const closeFileModal = () => {
    setSelectedFile(null);
  };

  return (
    <div className="dashboard-container">
      <header className="top-menu">
        <h2>DocManager</h2>
        <div className="user-info">
          <p>{userName}</p>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>
      {uploadStatus && (
        <div className={`popup-message ${uploadStatus}`}>
          <span>
            {uploadStatus === "success"
              ? "File uploaded successfully!"
              : "Error uploading file."}
          </span>
          <FiX className="close-icon" onClick={closePopup} />
        </div>
      )}
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
            <div className="document-grid">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="document-card"
                  onClick={() => openFileModal(file)}
                >
                  <div className="file-preview">
                    {file.fileType.startsWith("image/") ? (
                      <img
                        src={file.fileUrl}
                        alt={file.fileName}
                        className="file-image-preview"
                      />
                    ) : (
                      <div className="file-icon">📄</div>
                    )}
                  </div>
                  <div className="file-details">
                    <p>
                      <strong>Name:</strong> {truncateFileName(file.fileName)}
                    </p>
                    <p>
                      <strong>Upload Date:</strong>{" "}
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Type:</strong> {file.fileType}
                    </p>
                    <p>
                      <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      {selectedFile && (
        <div className="modal">
          <div className="modal-content">
            <FiX className="close-modal" onClick={closeFileModal} />
            <div className="file-preview">
              {selectedFile.fileType.startsWith("image/") ? (
                <img
                  src={selectedFile.fileUrl}
                  alt={selectedFile.fileName}
                  className="file-image-preview-full"
                />
              ) : (
                <iframe
                  src={selectedFile.fileUrl}
                  title={selectedFile.fileName}
                  className="file-iframe-preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
