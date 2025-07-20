const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'therapy', 'furniture', 'supplies', 'other']
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number,
    min: 0
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'out-of-service'],
    default: 'excellent'
  },
  image: {
    type: String // URL or file path
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
assetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Asset', assetSchema);