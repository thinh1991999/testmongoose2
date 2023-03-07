const express = require("express");
const User = require("../models/User");
const { auth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Create a new listing
router.post("/listings", auth, async (req, res) => {
  try {
    const user = req.user;
    if (user.isAdmin || user.isHost) {
      const {} = req.body;
      return res.status(200).send({ mess: "hello" });
    } else {
      return res
        .status(401)
        .send({ error: "Not authorized to access this resource" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
});

module.exports = router;
