import React, { useEffect, useState } from 'react';
import { getDocuments } from '../services/documentService';

function DocumentList() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      const docs = await getDocuments();
      setDocuments(docs);
    }
    fetchDocuments();
  }, []);

  return (
    <div>
      <h2>Documents</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            <a href={`/document/${doc.id}`}>{doc.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList;
