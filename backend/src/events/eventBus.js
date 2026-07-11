const EventEmitter = require('events');

const eventBus = new EventEmitter();
eventBus.setMaxListeners(50);

const EVENTS = {
  TELEMETRY_STORED: 'telemetry:stored',
};

module.exports = { eventBus, EVENTS };
