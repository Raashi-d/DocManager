const File = require('../Models/File');
const multer = require('multer');
const path = require('path');

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Export upload for use in routes
exports.upload = upload;

// Upload and save file metadata
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const fileData = new File({
      filename: file.filename,
      fileType: file.mimetype,
      size: file.size,
      fileUrl: `/uploads/${file.filename}`, // Update based on storage
    });

    await fileData.save();
    res.status(200).json({ message: 'File uploaded successfully', fileData });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
};

// Retrieve file metadata
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching file' });
  }
};

// Stream or download file
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.download(`./uploads/${file.filename}`, file.filename);
  } catch (error) {
    res.status(500).json({ error: 'File download failed' });
  }
};
