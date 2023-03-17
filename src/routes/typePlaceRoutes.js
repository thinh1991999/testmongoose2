const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const TypePlace = require("../models/TypePlace");

const typePlaceRoutes = express.Router();

// Create a new category
typePlaceRoutes.post("/typePlace/create", authAdmin, async (req, res) => {
  try {
    console.log(req.body);
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(401).send({
        error: "Invalid data",
      });
    }
    const newTypePlace = new TypePlace({
      name,
      description,
    });
    newTypePlace
      .save()
      .then((cate) => {
        return res.status(200).json({
          message: "Create new type place successful!",
          typePlace: cate,
        });
      })
      .catch((err) => {
        return res.status(401).send({ error: err.message });
      });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

// // Update a new category
// categoryRoutes.put(
//   "/category/update",
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
//       const id = req.query.id;
//       if (mongoose.Types.ObjectId.isValid(id)) {
//         Category.findByIdAndUpdate(id, {
//           name,
//           description,
//           icon_url: publicUrl,
//         })
//           .exec()
//           .then((cate) => {
//             return res.status(200).json({
//               message: "Update category successfully!",
//               category: cate,
//             });
//           })
//           .catch((error) => {
//             return res.status(401).send({ error: error.message });
//           });
//       } else {
//         return res.status(401).send({
//           error: "Invalid id",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       return res.status(401).send({ error: error.message });
//     }
//   }
// );

// // Get detail
// categoryRoutes.get("/category/detail", async (req, res) => {
//   try {
//     const id = req.query.id;
//     if (mongoose.Types.ObjectId.isValid(id)) {
//       Category.findById(id)
//         .exec()
//         .then((category) => {
//           if (category) {
//             return res.status(200).send({ message: "Success", category });
//           } else {
//             return res
//               .status(400)
//               .send({ error: "Dont have this id", category });
//           }
//         });
//     } else {
//       return res.status(401).send({ error: "invalid id" });
//     }
//   } catch (error) {
//     return res.status(401).send({ error: error.message });
//   }
// });

// Get all
typePlaceRoutes.get("/typePlace/all", async (req, res) => {
  try {
    TypePlace.find({ isDelete: false }).then((typePlaces) => {
      return res.status(200).send({ typePlaces });
    });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
});

// // Delete
// categoryRoutes.post("/category/delete", authAdmin, async (req, res) => {
//   try {
//     const id = req.body.id;
//     Category.findOneAndUpdate(
//       {
//         _id: id,
//       },
//       { isDelete: true },
//       { new: true }
//     )
//       .then((category) => {
//         return res.status(200).send({ category });
//       })
//       .catch((err) => {
//         return res.status(401).send({ error: err.message });
//       });
//   } catch (error) {
//     return res.status(401).send({ error: error.message });
//   }
// });

module.exports = typePlaceRoutes;
