const mongoose = require('mongoose');

const helmetSchema = new mongoose.Schema(
  {
    helmetId: {
      type: String,
      required: [true, 'helmetId is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    minerName: {
      type: String,
      trim: true,
      default: '',
    },
    deviceStatus: {
      type: String,
      enum: ['online', 'offline', 'error'],
      default: 'offline',
    },
    firmwareVersion: {
      type: String,
      trim: true,
      default: '',
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Helmet', helmetSchema);
