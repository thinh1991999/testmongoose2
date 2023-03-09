const express = require("express");
const User = require("../models/User");
const { auth, authAdmin } = require("../middlewares/auth");
const { validator } = require("../middlewares/room");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Room = require("../models/Room");
const { multerUploadsArr, uploadToStorage } = require("../middlewares/multer");

const router = express.Router();

// Create a new listing
router.post(
  "/room",
  auth,
  multerUploadsArr,
  [
    check("title", "title field is required").not().isEmpty(),
    check("description", "description field is required").not().isEmpty(),
    check("pricePerNight", "pricePerNight field is required").not().isEmpty(),
    check("locationX", "pricePerNight field is required").not().isEmpty(),
    check("locationY", "pricePerNight field is required").not().isEmpty(),
    check("address", "address field is required").not().isEmpty(),
    check("propertyType", "propertyType field is required").not().isEmpty(),
    check("guests", "guests field is required").not().isEmpty(),
    check("bedrooms", "bedrooms field is required").not().isEmpty(),
    check("beds", "beds field is required").not().isEmpty(),
    check("baths", "baths field is required").not().isEmpty(),
    check("bedrooms", "bedrooms field is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      if (!req.user.isAdmin && !req.user.isHost) {
        return res
          .status(401)
          .send({ error: "Not authorized to access this resource" });
      }
      if (req.fileValidationError) {
        return res.status(400).send({
          error: req.fileValidationError,
        });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      } else {
      }
      const imgArr = [];
      // for (let i = 0; i < req.files.length; i++) {
      //   const publicUrl = await uploadToStorage(req.files[i]);
      //   imgArr.push(publicUrl);
      // }
      const {
        title,
        description,
        pricePerNight,
        locationX,
        locationY,
        address,
        propertyType,
        guests,
        bedrooms,
        beds,
        baths,
        amenities = [],
        categories = [],
      } = req.body;
      const newRoom = new Room({
        title,
        description,
        pricePerNight,
        location: {
          type: "Point",
          coordinates: [locationY, locationX],
          address,
        },
        propertyType,
        guests,
        bedrooms,
        beds,
        baths,
        amenities,
        categories,
        images: imgArr,
        owner: req.user._id,
      });
      newRoom
        .save()
        .then((room) => {
          return res.status(200).send({
            message: "Create new room successfully!",
            room: room,
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

const options = {
  page: 1,
  limit: 10,
  collation: {
    locale: "en",
  },
};

router.get("/room/all", async (req, res) => {
  try {
    Room.paginate({}, options, function (err, result) {
      console.log(err, result);
      // result.docs
      // result.totalDocs = 100
      // result.limit = 10
      // result.page = 1
      // result.totalPages = 10
      // result.hasNextPage = true
      // result.nextPage = 2
      // result.hasPrevPage = false
      // result.prevPage = null
      // result.pagingCounter = 1
    });
  } catch (error) {
    return res.status(401).send({ error });
  }
});

module.exports = router;
