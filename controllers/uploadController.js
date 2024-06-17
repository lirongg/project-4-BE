// uploadController.js

const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary/config");
const fileUpload = require("express-fileupload");
const fs = require('fs');
const path = require('path');
const LocationImage = require('../models/locationImageModel'); // Import the LocationImage model

router.use(fileUpload());

router.post("/image", async function (req, res) {
  console.log("Request received");
  console.log("Request files:", req.files);
  console.log("Request body:", req.body);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.files.image;

  if (!imageFile) {
    return res.status(400).send("Image file is missing.");
  }

  const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, async function (err, result) {
    if (err) {
      console.error('Error uploading to Cloudinary:', err);
      return res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }

    try {
      const secureURL = result.secure_url;
      const imageId = result.public_id;

      // Check if this upload is for a location or an item
      if (req.body.location) {
        const location = req.body.location;

        // Save or update the location image
        let locationImage = await LocationImage.findOne({ location });

        if (locationImage) {
          // Update existing record
          locationImage.imageUrl = secureURL;
          locationImage.imageId = imageId;
          await locationImage.save();
        } else {
          // Create new record
          locationImage = new LocationImage({
            location,
            imageUrl: secureURL,
            imageId,
          });
          await locationImage.save();
        }

        res.status(200).json({ url: secureURL, location: locationImage });
      } else if (req.body.itemId) {
        // Handle item image upload logic if needed
        // You might want to store the image URL in the item document
        // For now, just return the uploaded image URL
        res.status(200).json({ url: secureURL });
      } else {
        // General image upload response
        res.status(200).json({ url: secureURL });
      }

    } catch (dbError) {
      console.error('Error saving image metadata:', dbError);
      res.status(500).json({ message: "Error saving image metadata", error: dbError });
    }
  });

  const tempFilePath = path.join(__dirname, 'tmp', imageFile.name);

  imageFile.mv(tempFilePath, function(err) {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).send(err);
    }

    fs.createReadStream(tempFilePath).pipe(uploadStream).on('end', () => {
      fs.unlink(tempFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temp file:', unlinkErr);
        }
      });
    }).on('error', (streamErr) => {
      console.error('Error in upload stream:', streamErr);
      return res.status(500).send(streamErr);
    });
  });
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
