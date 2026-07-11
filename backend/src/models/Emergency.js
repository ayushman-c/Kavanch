const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  helmetId: {
    type: String,
    required: [true, 'helmetId is required'],
    trim: true,
    uppercase: true,
    index: true,
  },
  emergencyType: {
    type: String,
    required: [true, 'emergencyType is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Emergency', emergencySchema);
