import React from 'react';
import UploadForm from '../components/UploadForm';
import './Upload.css';

function Upload() {
  return (
    <div className="upload-container">
      <h1>Upload a New Document</h1>
      <p>Fill in the details and select a file to upload to your document library.</p>
      <UploadForm />
    </div>
  );
}

export default Upload;
