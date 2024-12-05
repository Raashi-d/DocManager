import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiUpload,
  FiLogOut,
  FiX,
  FiTrash2,
  FiDownload,
  FiFile,
} from "react-icons/fi";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  // Fetch files with improved error handling and loading state
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFiles(response.data.files || []);
      setFilteredFiles(response.data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(error.response?.data?.message || "Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial file fetch
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Search functionality
  useEffect(() => {
    const filtered = files.filter(
      (file) =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.fileType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchTerm, files]);

  // File upload handler
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("userId", userId);

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUploadStatus("success");
      fetchFiles();
      setSearchTerm("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setError(error.response?.data?.message || "File upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  // File delete handler
  const handleDeleteFile = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:5000/api/files/${fileToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFileToDelete(null);
      fetchFiles();
      setSearchTerm("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error.response?.data?.message || "File deletion failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // File download handler
  const handleDownload = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${file._id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(
        "Failed to download file. " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // File preview handler
  const handleFilePreview = (file) => {
    setSelectedFile(file);
  };

  // Render file preview content
  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.fileType.startsWith("image/")) {
      return (
        <img
          src={selectedFile.fileUrl}
          alt={selectedFile.fileName}
          className="file-image-preview-full"
        />
      );
    }

    if (selectedFile.fileType === "application/pdf") {
      return (
        <iframe
          src={selectedFile.fileUrl}
          title={selectedFile.fileName}
          className="file-iframe-preview"
          frameBorder="0"
        />
      );
    }

    return (
      <div className="default-file-preview">
        <p>File preview not available for this file type.</p>
        <button
          className="download-button"
          onClick={() => handleDownload(selectedFile)}
        >
          <FiDownload /> Download File
        </button>
      </div>
    );
  };

  // Utility functions
  const truncateFileName = (fileName, maxLength = 20) => {
    return fileName.length > maxLength
      ? `${fileName.substring(0, maxLength)}...`
      : fileName;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Render file icon based on file type
  const renderFileIcon = (fileType) => {
    const iconMap = {
      "application/pdf": <FiFile className="text-red-500" />,
      "image/": <FiFile className="text-blue-500" />,
      "text/": <FiFile className="text-green-500" />,
      "application/msword": <FiFile className="text-indigo-500" />,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        <FiFile className="text-indigo-500" />,
      default: <FiFile className="text-gray-500" />,
    };

    const matchedIcon = Object.entries(iconMap).find(([key]) =>
      fileType.startsWith(key)
    );

    return matchedIcon ? matchedIcon[1] : iconMap["default"];
  };

  return (
    <div className="dashboard-container">
      {/* Top Menu */}
      <header className="top-menu">
        <h2>DocManager</h2>
        <div className="user-info">
          <p>{userName}</p>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* Status Messages */}
      {uploadStatus && (
        <div className={`popup-message ${uploadStatus}`}>
          <span>
            {uploadStatus === "success"
              ? "File uploaded successfully!"
              : "Error uploading file."}
          </span>
          <FiX className="close-icon" onClick={() => setUploadStatus(null)} />
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <FiX className="close-icon" onClick={() => setError(null)} />
        </div>
      )}

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Search and Upload Section */}
        <div className="dashboard-header">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FiX
                className="clear-search-icon"
                onClick={() => setSearchTerm("")}
              />
            )}
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

        {/* Documents Section */}
        <div className="content">
          <section className="documents">
            <h3>
              Documents
              {searchTerm && ` (${filteredFiles.length} results)`}
            </h3>

            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : filteredFiles.length === 0 ? (
              <p className="no-results">
                No documents found {searchTerm && `matching "${searchTerm}"`}
              </p>
            ) : (
              <div className="document-grid">
                {filteredFiles.map((file) => (
                  <div
                    key={file._id}
                    className="document-card"
                    onClick={() => handleFilePreview(file)}
                  >
                    <div className="file-preview">
                      {file.fileType.startsWith("image/") ? (
                        <img
                          src={file.fileUrl}
                          alt={file.fileName}
                          className="file-image-preview"
                        />
                      ) : (
                        <div className="file-icon">
                          {renderFileIcon(file.fileType)}
                        </div>
                      )}
                    </div>
                    <div className="file-details">
                      <p>
                        <strong>Name:</strong> {truncateFileName(file.fileName)}
                      </p>
                      <p>
                        <strong>Type:</strong> {file.fileType}
                      </p>
                      <p>
                        <strong>Size:</strong> {formatFileSize(file.size)}
                      </p>
                      <p>
                        <strong>Upload Date:</strong>
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="file-actions">
                        <button
                          className="view-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                          }}
                        >
                          <FiDownload /> Download
                        </button>
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFileToDelete(file);
                          }}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setSelectedFile(null)}
            >
              <FiX />
            </button>
            <div className="file-preview-container">{renderFilePreview()}</div>
            <div className="file-preview-details">
              <h3>{selectedFile.fileName}</h3>
              <p>Type: {selectedFile.fileType}</p>
              <p>Size: {formatFileSize(selectedFile.size)}</p>
              <p>
                Uploaded: {new Date(selectedFile.uploadDate).toLocaleString()}
              </p>
              <div className="file-preview-actions">
                <button
                  className="download-button"
                  onClick={() => handleDownload(selectedFile)}
                >
                  <FiDownload /> Download
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    setFileToDelete(selectedFile);
                    setSelectedFile(null);
                  }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{fileToDelete.fileName}"?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDeleteFile}>
                Confirm Delete
              </button>
              <button
                className="cancel-button"
                onClick={() => setFileToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
