const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const File = require("../Models/File");
require("dotenv").config();

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file to S3 and save metadata to MongoDB.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.uploadFile = async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  if (!file || !userId) {
    return res.status(400).json({ error: "File and userId are required" });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Upload file to S3
    const command = new PutObjectCommand(params);
    const s3Response = await s3Client.send(command);

    // Save file metadata to MongoDB
    const newFile = new File({
      fileName: file.originalname,
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
      fileType: file.mimetype,
      size: file.size,
      uploadBy: new mongoose.Types.ObjectId(userId),
    });

    const savedFile = await newFile.save();

    res.status(201).json({
      message: "File uploaded and metadata saved successfully!",
      file: savedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "File upload failed. Please try again." });
  }
};

/**
 * Get files uploaded by a specific user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserFiles = async (req, res) => {
  const { userId } = req.params; // Retrieve userId from the URL parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find files uploaded by the specific user
    const files = await File.find({ uploadBy: userId });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for this user" });
    }

    res.status(200).json({
      message: "Files retrieved successfully!",
      files: files,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve files. Please try again." });
  }
};

/**
 * Delete a file from S3 and MongoDB.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteFile = async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ error: "File ID is required" });
  }

  try {
    // Find the file in the database
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file from S3
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.fileUrl.split("/").pop(),
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);

    // Delete the file metadata from MongoDB
    await File.findByIdAndDelete(fileId);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file. Please try again." });
  }
};

/**
 * Download a file from S3.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.downloadFile = async (req, res) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ error: "File ID is required" });
  }

  try {
    // Find the file in the database
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Create download parameters for S3
    const getParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.fileUrl.split("/").pop(),
    };

    // Use S3 GetObjectCommand to retrieve the file
    const { Body } = await s3Client.send(new GetObjectCommand(getParams));

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );
    res.setHeader("Content-Type", file.fileType);

    // Stream the file to the response
    Body.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "File download failed. Please try again." });
  }
};
