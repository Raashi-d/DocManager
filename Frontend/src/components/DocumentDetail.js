import React, { useEffect, useState } from 'react';
import { getDocumentById } from '../services/documentService';
import { useParams } from 'react-router-dom';

function DocumentDetail() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    async function fetchDocument() {
      const doc = await getDocumentById(id);
      setDocument(doc);
    }
    fetchDocument();
  }, [id]);

  if (!document) return <div>Loading...</div>;

  return (
    <div>
      <h2>{document.title}</h2>
      <a href={document.fileURL} download>Download</a>
    </div>
  );
}

export default DocumentDetail;
