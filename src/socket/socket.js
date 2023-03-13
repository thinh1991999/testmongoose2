const mongoose = require("mongoose");

const startSocket = (io) => {
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connected");

    console.log("Setting change streams");
    const reviewChangeStream = connection.collection("reviews").watch();

    reviewChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          const { _id, room } = change.fullDocument;
          const review = {
            _id: change.fullDocument._id,
            name: change.fullDocument.name,
            description: change.fullDocument.description,
          };
          const reviewSpace = io.of("/reviews");
          reviewSpace.on("connection", (socket) => {
            socket.join(room); // distinct from the room in the "orders" namespace
            reviewSpace.to(room).emit("newReview", review);
          });
          break;
        case "delete":
          // io.of("/api/socket").emit("deletedThought", change.documentKey._id);
          break;
      }
    });
  });
};

module.exports = startSocket;
