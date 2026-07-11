const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  helmetId: {
    type: String,
    required: [true, 'helmetId is required'],
    trim: true,
    uppercase: true,
    index: true,
  },
  heartRate: {
    type: Number,
    default: null,
  },
  spo2: {
    type: Number,
    default: null,
  },
  bodyTemperature: {
    type: Number,
    default: null,
  },
  gasLevel: {
    type: Number,
    default: null,
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  packetNumber: {
    type: Number,
    default: null,
  },
  rawPayload: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  processingTime: {
    type: Number,
    default: null,
  },
});

telemetrySchema.index({ helmetId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
