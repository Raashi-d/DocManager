const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('File', fileSchema);
