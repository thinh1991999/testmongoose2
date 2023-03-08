const express = require("express");
const User = require("../models/User");
const { auth, authAdmin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { multerUploads, uploadToStorage } = require("../middlewares/multer");
const Category = require("../models/Category");

const categoryRoutes = express.Router();

// Create a new category
categoryRoutes.post("/category", multerUploads, async (req, res) => {
  try {
    const publicUrl = await uploadToStorage(req.file);
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(401).send({
        error: "Invalid data",
      });
    }
    const newCategory = new Category({
      name,
      description,
      icon_url: publicUrl,
    });
    newCategory
      .save()
      .then((cate) => {
        return res.status(200).json({
          message: "Create new category successfully!",
          category: cate,
        });
      })
      .catch((err) => {
        return res.status(401).send({ error: err.message });
      });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

// categoryRoutes.get("/amenity/all", async (req, res) => {
//   try {
//     Amenity.find({}).then((aminities) => {
//       return res.status(200).send({ aminities });
//     });
//   } catch (error) {
//     return res.status(401).send({ error: error.message });
//   }
// });

// categoryRoutes.post(
//   "/amenity/update",
//   authAdmin,
//   multerUploads,
//   async (req, res) => {
//     try {
//       const publicUrl = await uploadToStorage(req.file);
//       const { name, description } = req.body;
//       if (!name || !description) {
//         return res.status(401).send({
//           error: "Invalid data",
//         });
//       }
//       const newAmenity = new Amenity({
//         name,
//         description,
//         icon_url: publicUrl,
//       });
//       newAmenity
//         .save()
//         .then((amen) => {
//           console.log(amen);
//           return res.status(200).json({
//             message: "Update successfully!",
//             amenity: amen,
//           });
//         })
//         .catch((err) => {
//           return res.status(401).send({ error: err.message });
//         });
//     } catch (error) {
//       console.log(error);
//       return res.status(401).send({ error: error.message });
//     }
//   }
// );

module.exports = categoryRoutes;
