//schema for item - item name, description, qty, category, expiry date (if applicable)
const mongoose = require("mongoose");
const User = require("./userModel");

const itemSchema = mongoose.Schema(
  {
    item: {
      type: String,
      require: true,
      unique: true,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
