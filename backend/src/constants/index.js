module.exports = {
  HELMET_STATUS: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    ERROR: 'error',
  },

  ALERT_SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },

  ALERT_STATUS: {
    ACTIVE: 'active',
    RESOLVED: 'resolved',
    ACKNOWLEDGED: 'acknowledged',
  },

  EMERGENCY_TYPE: {
    SOS: 'sos',
    FALL: 'fall',
    GAS_LEAK: 'gas_leak',
    HIGH_TEMPERATURE: 'high_temperature',
  },

  EMERGENCY_STATUS: {
    ACTIVE: 'active',
    RESOLVED: 'resolved',
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
};
