/* eslint-disable no-undef */
const Asset = require('../models/Asset');
const path = require('path');
const fs = require('fs');

// Get all assets
const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assets',
      error: error.message
    });
  }
};

// Get single asset
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching asset',
      error: error.message
    });
  }
};

// Create new asset
const createAsset = async (req, res) => {
  try {
    const assetData = req.body;
    
    // Add image path if file was uploaded
    if (req.file) {
      assetData.image = `/uploads/assets/${req.file.filename}`;
    }

    const asset = new Asset(assetData);
    const savedAsset = await asset.save();
    
    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: savedAsset
    });
  } catch (error) {
    // Delete uploaded file if database save fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Serial number already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating asset',
      error: error.message
    });
  }
};

// Update asset
const updateAsset = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Add new image path if file was uploaded
    if (req.file) {
      updateData.image = `/uploads/assets/${req.file.filename}`;
      
      // Delete old image file
      const oldAsset = await Asset.findById(req.params.id);
      if (oldAsset && oldAsset.image) {
        const oldImagePath = path.join(__dirname, '..', oldAsset.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }

    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      message: 'Asset updated successfully',
      data: asset
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error updating asset',
      error: error.message
    });
  }
};

// Delete asset
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Delete associated image file
    if (asset.image) {
      const imagePath = path.join(__dirname, '..', asset.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting asset',
      error: error.message
    });
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
};