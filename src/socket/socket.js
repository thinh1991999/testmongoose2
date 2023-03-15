const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const User = require("../models/User");

const startSocket = (io) => {
  const connection = mongoose.connection;

  io.of("/reviews").on("connection", (socket) => {
    console.log("socket.io: User connected: ", socket.id);
    socket.on("join_room", (data) => {
      socket.join(data);
    });
    socket.on("disconnect", () => {
      console.log("socket.io: User disconnected: ", socket.id);
    });
  });

  connection.once("open", () => {
    console.log("MongoDB database connected");

    console.log("Setting change streams");
    const reviewChangeStream = connection.collection("reviews").watch();
    reviewChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          const {
            _id,
            rating,
            description,
            room,
            createdAt,
            updatedAt,
            owner,
          } = change.fullDocument;
          User.findById(owner)
            .select([
              "_id",
              "email",
              "firstName",
              "lastName",
              "profilePic",
              "bio",
              "phoneNumber",
              "gender",
              "dateOfBirth",
              "address",
            ])
            .then((user) => {
              const review = {
                _id,
                description,
                rating,
                room,
                createdAt,
                updatedAt,
                owner: user,
              };
              io.of("/reviews").to(room.toString()).emit("new_review", review);
            });

          break;
        case "update":
          const id = change.documentKey._id;
          const vlChange = change.updateDescription.updatedFields;
          io.of("/reviews").emit("update_review", {
            id,
            vlChange,
          });
          break;
        case "delete":
          io.of("/reviews").emit("delete_review", change.documentKey._id);
          break;
      }
    });
  });
};

module.exports = startSocket;
