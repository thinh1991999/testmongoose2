const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon_url: {
      type: Object,
      required: true,
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

const Amenity = mongoose.model("Amenity", amenitySchema);

module.exports = Amenity;
