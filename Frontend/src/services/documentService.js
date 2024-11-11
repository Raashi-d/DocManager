import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

export const getDocuments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

export const getDocumentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
