const express = require("express");
const User = require("../models/User");
const { authAdmin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminRouters = express.Router();

// Create a new admin
adminRouters.post("/admin", authAdmin, async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    User.findOne({ email })
      .exec()
      .then((user) => {
        if (user === null) {
          const newUser = new User({
            email,
            firstName,
            lastName,
            password,
            isAdmin: true,
          });
          newUser
            .save()
            .then(() => {
              return res.status(200).send({
                message: "Đăng ký thành công",
              });
            })
            .catch((err) => {
              return res.status(400).send(err);
            });
        } else {
          return res.status(400).send({
            error: "Email này đã được đăng ký!",
          });
        }
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

// Login
adminRouters.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    if (!user.isAdmin)
      return res
        .status(400)
        .send({ error: "Not authorized to access this resource" });
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    return res.status(401).send({
      error: error.message,
    });
  }
});

// Detail admin
adminRouters.get("/admin/me", authAdmin, async (req, res) => {
  return res.send(req.user);
});

// Logout
adminRouters.post("/admin/me/logout", authAdmin, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// // Update
adminRouters.post("/admin/me/update", authAdmin, async (req, res) => {
  try {
    const {
      phoneNumber,
      firstName,
      lastName,
      bio,
      gender,
      dateOfBirth,
      address,
    } = req.body;

    User.findOneAndUpdate(
      { email: req.email },
      { phoneNumber, firstName, lastName, bio, gender, dateOfBirth, address },
      { runValidators: true }
    )
      .then((user) => {
        if (user) {
          return res.status(200).send({ mess: "Cap nhat thanh cong" });
        } else {
          return res
            .status(500)
            .send({ error: "Có lỗi xảy ra, vui lòng thử lại" });
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = adminRouters;
