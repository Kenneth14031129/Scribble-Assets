const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  login,
  getProfile,
  changePassword,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture
} = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   POST /api/auth/upload-profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/upload-profile-picture', auth, upload.single('profilePicture'), uploadProfilePicture);

// @route   DELETE /api/auth/profile-picture
// @desc    Delete profile picture
// @access  Private
router.delete('/profile-picture', auth, deleteProfilePicture);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', auth, changePassword);

module.exports = router;