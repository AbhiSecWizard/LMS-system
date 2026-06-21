const express = require("express");
const upload = require("../utils/multer");
const { uploadMedia } = require("../utils/cloudinary");
const mediaRouter = express.Router();

mediaRouter.post("/upload-video", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const result = await uploadMedia(req.file.path);
        
        // FIXED: Changed res.status.json to res.status().json()
        return res.status(200).json({
            success: true, 
            message: "File uploaded successfully",
            data: result
        });
    } catch (error) {
        console.error("Cloudinary route error:", error);
        return res.status(500).json({
            success: false,
            message: "Error uploading file to storage"
        });
    }
});

module.exports = mediaRouter;