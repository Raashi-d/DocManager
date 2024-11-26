require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileRoutes = require('./Routes/fileRoutes');
const userRoutes = require('./Routes/userRoutes');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Enable CORS for requests from your React frontend
app.use(cors({}));
// origin: process.env.CLIENT_URL

// Middleware
app.use(express.json());

// Routes
//app.use('/api/files', fileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/files', fileRoutes);

// Start the server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
