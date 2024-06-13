const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary/config");
const fileUpload = require("express-fileupload");
const fs = require('fs');
const path = require('path');

router.use(fileUpload());

router.post("/image", function (req, res) {
  console.log("Request received");
  console.log("Request files:", req.files);
  console.log("Request body:", req.body);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.files.image;

  console.log("Image file received:", imageFile);

  if (!imageFile) {
    return res.status(400).send("Image file is missing.");
  }

  const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, function (err, result) {
    if (err) {
      console.error('Error uploading to Cloudinary:', err);
      return res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }
    const secureURL = result.secure_url;
    res.status(200).json({ url: secureURL });
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

module.exports = router;
