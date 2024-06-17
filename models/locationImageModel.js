//schema for item - item name, description, qty, category, expiry date (if applicable)
const mongoose = require("mongoose");

const locationImageSchema = mongoose.Schema(
  {
    location: { type: String, required: true, unique: true }, // e.g., "Living Room"
  imageUrl: { type: String, required: true }, // URL to the Cloudinary image
  imageId: { type: String, required: true }, // ID from Cloudinary for easy deletion if needed
  uploadedAt: { type: Date, default: Date.now },
});

const LocationImage = mongoose.model('LocationImage', locationImageSchema);

module.exports = LocationImage;