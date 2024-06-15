const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");

// all the post, get, put delete routes [router.pose("/create", userCtrl.createitem)]
router.post('/sign-up', userCtrl.create)
router.post('/sign-in',userCtrl.signIn)
router.get("/:id", userCtrl.getUserItems);
module.exports = router;