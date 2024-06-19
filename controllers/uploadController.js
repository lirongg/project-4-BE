const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary/config");
const fs = require('fs');
const path = require('path');
const LocationImage = require('../models/locationImageModel');
const upload = require("../multer_mw/multer"); 

// Function to upload image to Cloudinary
const uploadImageToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    fs.createReadStream(filePath)
      .pipe(uploadStream)
      .on('end', () => {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
        });
      })
      .on('error', (streamErr) => reject(streamErr));
  });
};

// Route for handling image uploads
router.post("/image", upload.single('image'), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.file;
  const tempFilePath = path.join(__dirname, '../assets', imageFile.originalname);

  try {
    // Upload the file to Cloudinary
    const result = await uploadImageToCloudinary(tempFilePath);
    const secureURL = result.secure_url;
    const imageId = result.public_id;

    // Handle location image logic
    if (req.body.location) {
      const location = req.body.location;
      let locationImage = await LocationImage.findOne({ location });
      if (locationImage) {
        locationImage.imageUrl = secureURL;
        locationImage.imageId = imageId;
        await locationImage.save();
      } else {
        locationImage = new LocationImage({
          location,
          imageUrl: secureURL,
          imageId,
        });
        await locationImage.save();
      }
      return res.status(200).json({ url: secureURL, location: locationImage });
    } else if (req.body.itemId) {
      return res.status(200).json({ url: secureURL });
    } else {
      return res.status(200).json({ url: secureURL });
    }
  } catch (error) {
    console.error('Error processing image upload:', error);
    return res.status(500).json({ message: "Error processing image upload", error });
  }
});

// Route for fetching image by location
router.get('/image/:location', async function (req, res) {
  const { location } = req.params;
  try {
    const locationImage = await LocationImage.findOne({ location });
    if (!locationImage) {
      return res.status(404).json({ message: 'Image not found for this location' });
    }
    res.status(200).json(locationImage);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving location image', error });
  }
});

module.exports = router;
