const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    parentReviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: false,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
reviewSchema.plugin(paginate);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
