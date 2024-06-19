
const mongoose = require("mongoose");

const locationImageSchema = mongoose.Schema(
  {
    location: { type: String, required: true, unique: true }, 
  imageUrl: { type: String, required: true }, 
  imageId: { type: String, required: true }, 
  uploadedAt: { type: Date, default: Date.now },
});

const LocationImage = mongoose.model('LocationImage', locationImageSchema);

module.exports = LocationImage;