const mongoose = require("mongoose");

const propertyTypeSchema = new mongoose.Schema(
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

const PropertyType = mongoose.model("PropertyType", propertyTypeSchema);

module.exports = PropertyType;
