const express = require("express");
const multer = require("multer");
const { detectCuisine } = require("../controllers/imageSearchController");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });

// API to detect cuisine from uploaded image
router.post("/", upload.single("image"), detectCuisine);

module.exports = router;
