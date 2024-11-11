import React from 'react';
import DocumentList from '../components/DocumentList';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Document Manager</h1>
        <p>Your one-stop solution for secure, organized document storage and retrieval.</p>
        <Link to="/upload" className="upload-button">Upload New Document</Link>
      </header>

      <section className="document-list-section">
        <h2>Available Documents</h2>
        <DocumentList />
      </section>
    </div>
  );
}

export default Home;
