const express = require("express");
const User = require("../models/User");
const { auth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { multerUploads, uploadToStorage } = require("../middlewares/multer");

const router = express.Router();

// Create a new listing
router.post("/amenity", auth, multerUploads, async (req, res) => {
  try {
    const user = req.user;
    if (user.isAdmin) {
      const publicUrl = await uploadToStorage(req.file);
      return res
        .status(200)
        .json({ message: "File uploaded successfully!", imageUrl: publicUrl });
    } else {
      return res
        .status(401)
        .send({ error: "Not authorized to access this resource" });
    }
  } catch (error) {
    return res.status(401).send({ error: error });
  }
});

module.exports = router;
