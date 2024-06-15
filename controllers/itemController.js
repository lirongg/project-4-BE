const Item = require("../models/itemModel.js");
const mongoose = require("mongoose");

const createItem = async (req, res) => {
  try {
    const itemData = {
      item: req.body.item,
      location: req.body.location,
      description: req.body.description,
      createdBy: req.user._id,
      images: req.body.imageURL ? [req.body.imageURL] : [], 
    };

    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: error.message });
  }
};

async function getItems(req, res) {
  try {
    const getitem = await Item.find({});
    return res.status(200).json(getitem);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id.trim(), req.body, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function searchItems(req, res) {
  try {
    const { query } = req.query;
    console.log(`Search query: ${query}`); 

    const items = await Item.find({
      $or: [
        { item: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    console.log(`Items found: ${items.length}`); 
    return res.status(200).json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function getitemlocation(req, res) {
  try {
    const location = req.params.location;
    const items = await Item.find({ location });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getUserItems = async (req, res) => {
  try {
    const userItems = await Item.find({ createdBy: req.params.id });
    res.status(200).json(userItems);
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  getItems,
  searchItems,
  getitemlocation,
  getUserItems
};
