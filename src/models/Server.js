const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['free', 'paid'],
    required: true
  },
  category: {
    type: String,
    enum: ['gaming', 'web', 'bot', 'database', 'storage', 'compute'],
    required: true
  },
  specs: {
    cpu: String,
    ram: String,
    storage: String,
    bandwidth: String
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'online'
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  capacity: {
    total: { type: Number, required: true },
    used: { type: Number, default: 0 }
  },
  connectionDetails: {
    host: String,
    port: Number,
    username: String,
    password: String,
    protocol: {
      type: String,
      enum: ['ssh', 'ftp', 'http', 'https'],
      default: 'ssh'
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp
serverSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for availability percentage
serverSchema.virtual('availabilityPercentage').get(function() {
  if (this.capacity.total === 0) return 0;
  return Math.round((1 - this.capacity.used / this.capacity.total) * 100);
});

module.exports = mongoose.model('Server', serverSchema);