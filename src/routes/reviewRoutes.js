const express = require("express");
const User = require("../models/User");
const { auth, authAdmin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { multerUploads, uploadToStorage } = require("../middlewares/multer");
const Review = require("../models/Review");
const { check, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const reviewRoutes = express.Router();

// Create a new review
reviewRoutes.post(
  "/review/create",
  auth,
  [
    check("rating", "rating field is required").not().isEmpty(),
    check("rating", "rating field is a number").isNumeric(),
    check("description", "description field is required").not().isEmpty(),
    check("room", "room field is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const { name, room, rating, description } = req.body;
      const userid = req.user._id;
      const newReview = new Review({
        name,
        room,
        rating,
        description,
        owner: userid,
      });
      newReview
        .save()
        .then((review) => {
          User.findByIdAndUpdate(userid, { $push: { reviews: review._id } })
            .exec()
            .then(() => {
              return res.status(200).send({
                message: "Create a review successfull",
                review,
              });
            })
            .catch((err) => {
              return res.status(401).send({ error: err.message });
            });
        })
        .catch((err) => {
          return res.status(401).send({ error: err.message });
        });
    } catch (error) {
      return res.status(401).send({ error: error.message });
    }
  }
);

// update review
reviewRoutes.put(
  "/review/update",
  auth,
  [
    check("rating", "rating field is required").not().isEmpty(),
    check("rating", "rating field is a number").isNumeric(),
    check("description", "description field is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const id = req.query.id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const { rating, description } = req.body;
        Review.findOneAndUpdate(
          {
            _id: id,
            owner: req.user._id,
          },
          {
            rating,
            description,
          },
          {
            new: true,
          }
        )
          .exec()
          .then((review) => {
            if (!review) {
              return res.status(401).send({
                error:
                  "Dont have this review id or you dont have permission to update this",
              });
            }
            return res.status(200).send({
              message: "Update a review successfull",
              review,
            });
          })
          .catch((err) => {
            return res.status(401).send({ error: err.message });
          });
      } else {
        return res.status(401).send({ error: "Invalid id" });
      }
    } catch (error) {
      return res.status(401).send({ error: error.message });
    }
  }
);

// delete review
reviewRoutes.delete("/review/delete", auth, async (req, res) => {
  try {
    const id = req.query.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const { rating, description } = req.body;
      Review.findOneAndDelete({
        _id: id,
        owner: req.user._id,
      })
        .exec()
        .then((review) => {
          if (!review) {
            return res.status(401).send({
              error:
                "Dont have this review id or you dont have permission to delete this",
            });
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $pull: { reviews: id } },
            { safe: true, upsert: true }
          )
            .exec()
            .then((user) => {
              if (!user) {
                return res.status(401).send({
                  error:
                    "Dont have this review id or you dont have permission to delete this",
                });
              }
              return res.status(200).send({
                message: "Delete review successfull",
                review,
              });
            });
        })
        .catch((err) => {
          return res.status(401).send({ error: err.message });
        });
    } else {
      return res.status(401).send({ error: "Invalid id" });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

// like review
reviewRoutes.delete("/review/delete", auth, async (req, res) => {
  try {
    const id = req.query.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      Review.findOneAndDelete({
        _id: id,
        owner: req.user._id,
      })
        .exec()
        .then((review) => {
          if (!review) {
            return res.status(401).send({
              error:
                "Dont have this review id or you dont have permission to delete this",
            });
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $pull: { reviews: id } },
            { safe: true, upsert: true }
          )
            .exec()
            .then((user) => {
              if (!user) {
                return res.status(401).send({
                  error:
                    "Dont have this review id or you dont have permission to delete this",
                });
              }
              return res.status(200).send({
                message: "Delete review successfull",
                review,
              });
            });
        })
        .catch((err) => {
          return res.status(401).send({ error: err.message });
        });
    } else {
      return res.status(401).send({ error: "Invalid id" });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

const options = {
  page: 1,
  limit: 100,
  sort: { createdAt: "desc" },
  populate: [
    {
      path: "owner",
      select: ["firstName", "lastName", "profilePic"],
    },
  ],
  collation: {
    locale: "en",
  },
};

reviewRoutes.get("/review/all", async (req, res) => {
  try {
    const id = req.query.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      Review.paginate({ room: id }, options, function (err, result) {
        return res.status(200).send({
          err,
          result,
        });
      });
    } else {
      return res.status(401).send({ error: "Invalid id" });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

module.exports = reviewRoutes;
