const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  helmetId: {
    type: String,
    required: [true, 'helmetId is required'],
    trim: true,
    uppercase: true,
    index: true,
  },
  type: {
    type: String,
    required: [true, 'alert type is required'],
    trim: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'severity is required'],
  },
  message: {
    type: String,
    required: [true, 'message is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'acknowledged'],
    default: 'active',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', alertSchema);
