const express = require('express');
const multer = require('multer');
const fileController = require('../Controller/fileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// Define routes
router.post('/upload', upload.single('file'), fileController.uploadFile);

module.exports = router;
