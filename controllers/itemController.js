// Controller methods for item management
// Add, delete, find, edit

const Item = require("../models/itemModel.js");

async function createItem(req, res) {
  try {
    const item = await Item.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function getUserItems(req, res) {
  try{ 
    console.log(req.params)
    const getuseritem = await Item.find({_id: req.params.id});
  return res.status(200).json(getuseritem);
}catch (error) {
  console.error(error);
  return res.status(500).json({error:error.message})
}
}

async function getItems(req, res) {
  try {
    const getitem = await Item.find({});
    return res.status(200).json(getitem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateItem(req, res) {
    try {
      const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(
      id.trim(), 
      req.body,
      { new: true }
      );
      res.status(200).json(updatedListing);
      
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
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  module.exports = {createItem, updateItem, deleteItem, getUserItems, getItems}