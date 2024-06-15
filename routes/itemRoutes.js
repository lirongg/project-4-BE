const express = require("express");
const router = express.Router();
const itemCtrl = require("../controllers/itemController");

// all the post, get, put delete routes [router.pose("/create", itemCtrl.createitem)]
router.get("/search", itemCtrl.searchItems)
router.post("/create", itemCtrl.createItem);
router.get("/", itemCtrl.getItems)
router.put('/update/:id', itemCtrl.updateItem);
router.delete('/delete/:id', itemCtrl.deleteItem);
router.get('/location/:location',itemCtrl.getitemlocation);
router.get("/:id", itemCtrl.getUserItems);


module.exports = router;