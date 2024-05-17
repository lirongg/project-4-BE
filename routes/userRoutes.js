const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");

// all the post, get, put delete routes [router.pose("/create", userCtrl.createitem)]
router.post('/', userCtrl.create)
router.post('/sign-in',userCtrl.signIn)
module.exports = router;