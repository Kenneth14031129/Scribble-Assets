const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');

// @route   GET /api/assets
// @desc    Get all assets
router.get('/', getAllAssets);

// @route   GET /api/assets/:id
// @desc    Get single asset
router.get('/:id', getAssetById);

// @route   POST /api/assets
// @desc    Create new asset (with optional image upload)
router.post('/', upload.single('image'), createAsset);

// @route   PUT /api/assets/:id
// @desc    Update asset (with optional image upload)
router.put('/:id', upload.single('image'), updateAsset);

// @route   DELETE /api/assets/:id
// @desc    Delete asset
router.delete('/:id', deleteAsset);

module.exports = router;