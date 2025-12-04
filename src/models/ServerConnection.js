const mongoose = require('mongoose');

const serverConnectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'disconnected', 'suspended'],
    default: 'active'
  },
  sessionData: {
    authToken: String,
    expiresAt: Date
  }
});

// Index for efficient queries
serverConnectionSchema.index({ user: 1, server: 1 }, { unique: true });
serverConnectionSchema.index({ server: 1, status: 1 });

module.exports = mongoose.model('ServerConnection', serverConnectionSchema);