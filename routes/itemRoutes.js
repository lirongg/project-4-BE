const express = require("express");
const router = express.Router();
const itemCtrl = require("../controllers/itemController");

// all the post, get, put delete routes [router.pose("/create", itemCtrl.createitem)]

router.get("/search", itemCtrl.searchItems)
router.get('/locations', itemCtrl.getAllLocations);
router.post("/create", itemCtrl.createItem);
router.get("/", itemCtrl.getItems)
router.put('/update/:id', itemCtrl.updateItem);
router.delete('/delete/:id', itemCtrl.deleteItem);
router.get('/location/:location',itemCtrl.getitemlocation);
router.get("/:id", itemCtrl.getUserItems);
router.get("/item/:id", itemCtrl.getitemId);
router.put('/item/relocate', itemCtrl.updateItemLocation);



module.exports = router;