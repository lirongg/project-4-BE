const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary/config");
const fileUpload = require("express-fileupload");
const fs = require('fs');
const path = require('path');
const LocationImage = require('../models/locationImageModel');

router.use(fileUpload());

const uploadImageToCloudinary = (imageFile) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    const tempFilePath = path.join(__dirname, 'tmp', imageFile.name);

    imageFile.mv(tempFilePath, (err) => {
      if (err) return reject(err);
      fs.createReadStream(tempFilePath)
        .pipe(uploadStream)
        .on('end', () => {
          fs.unlink(tempFilePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          });
        })
        .on('error', (streamErr) => reject(streamErr));
    });
  });
};

router.post("/image", async function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.files.image;
  if (!imageFile) {
    return res.status(400).send("Image file is missing.");
  }

  try {
    const result = await uploadImageToCloudinary(imageFile);
    const secureURL = result.secure_url;
    const imageId = result.public_id;

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
