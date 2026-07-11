const broadcastAlertNew = (io, alert) => {
  io.to('dashboard').emit('alert:new', alert);
  if (alert.helmetId) {
    io.to(`helmet:${alert.helmetId}`).emit('alert:new', alert);
  }
};

const broadcastAlertResolved = (io, alert) => {
  io.to('dashboard').emit('alert:resolved', alert);
  if (alert.helmetId) {
    io.to(`helmet:${alert.helmetId}`).emit('alert:resolved', alert);
  }
};

module.exports = { broadcastAlertNew, broadcastAlertResolved };
