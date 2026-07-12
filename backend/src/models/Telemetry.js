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
  /* ESP32-specific fields */
  humidity: { type: Number, default: null },
  mq6: { type: Number, default: null },
  mq4: { type: Number, default: null },
  mq8: { type: Number, default: null },
  worker: { type: String, default: '' },
  status: { type: String, default: '' },
  sos: { type: Boolean, default: false },
  latency: { type: Number, default: null },
  packetLoss: { type: Number, default: null },
  gatewayRSSI: { type: Number, default: null },
  relayRSSI: { type: Number, default: null },
  gatewayDistance: { type: Number, default: null },
  relayDistance: { type: Number, default: null },
  gatewaySignal: { type: Number, default: null },
  relaySignal: { type: Number, default: null },
  helmetOnline: { type: Boolean, default: false },
  relayOnline: { type: Boolean, default: false },
  gatewayOnline: { type: Boolean, default: false },
});

telemetrySchema.index({ helmetId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
