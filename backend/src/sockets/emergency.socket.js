const broadcastEmergencyNew = (io, emergency) => {
  io.to('dashboard').emit('emergency:new', emergency);
  if (emergency.helmetId) {
    io.to(`helmet:${emergency.helmetId}`).emit('emergency:new', emergency);
  }
};

const broadcastEmergencyResolved = (io, emergency) => {
  io.to('dashboard').emit('emergency:resolved', emergency);
  if (emergency.helmetId) {
    io.to(`helmet:${emergency.helmetId}`).emit('emergency:resolved', emergency);
  }
};

module.exports = { broadcastEmergencyNew, broadcastEmergencyResolved };
