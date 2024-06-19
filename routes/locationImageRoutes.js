const express = require('express');
const router = express.Router();
const cloudinary = require('../cloudinary/config');
const fs = require('fs');
const path = require('path');
const LocationImage = require('../models/locationImageModel'); 
const multer = require('multer');

const upload = multer({
  dest: path.join(__dirname, 'tmp')
});


// Helper function to upload image to Cloudinary
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

// Route to upload and save location image
router.post("/image", upload.single('image'), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.file;
  const tempFilePath = imageFile.path; // Path to the uploaded file by Multer

  try {
    // Upload the file to Cloudinary
    const result = await uploadImageToCloudinary(tempFilePath);
    const secureURL = result.secure_url;

    const location = req.body.location;

    // Save the image URL to the database
    let locationImage = await LocationImage.findOne({ location });

    if (locationImage) {
      // Update existing record
      locationImage.imageUrl = secureURL;
      await locationImage.save();
    } else {
      // Create new record
      locationImage = new LocationImage({
        location,
        imageUrl: secureURL,
      });
      await locationImage.save();
    }

    res.status(200).json({ url: secureURL, location: locationImage });
  } catch (error) {
    console.error('Error processing image upload:', error);
    return res.status(500).json({ message: "Error processing image upload", error });
  }
});

// Route to retrieve the image for a specific location
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
