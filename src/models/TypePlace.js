const mongoose = require("mongoose");

const typePlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const TypePlace = mongoose.model("TypePlace", typePlaceSchema);

module.exports = TypePlace;
