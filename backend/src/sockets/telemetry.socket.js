const broadcastTelemetryUpdate = (io, telemetry) => {
  io.to('dashboard').emit('telemetry:update', telemetry);
  if (telemetry.helmetId) {
    io.to(`helmet:${telemetry.helmetId}`).emit('telemetry:update', telemetry);
  }
};

module.exports = { broadcastTelemetryUpdate };
