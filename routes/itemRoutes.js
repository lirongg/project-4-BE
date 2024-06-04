const express = require("express");
const router = express.Router();
const itemCtrl = require("../controllers/itemController");

// all the post, get, put delete routes [router.pose("/create", itemCtrl.createitem)]
router.post("/create", itemCtrl.createItem);
router.put('/update/:id', itemCtrl.updateItem);
router.delete('/delete/:id', itemCtrl.deleteItem);

module.exports = router;