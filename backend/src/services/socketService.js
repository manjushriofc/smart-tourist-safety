let ioInstance = null;

export function initSocketService(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}

export function broadcastTouristUpdate(tourist) {
  if (ioInstance) {
    ioInstance.emit('tourist:updated', tourist);
  }
}

export function broadcastIncidentCreated(incident) {
  if (ioInstance) {
    ioInstance.emit('incident:created', incident);
  }
}

export function broadcastIncidentUpdated(incident) {
  if (ioInstance) {
    ioInstance.emit('incident:updated', incident);
  }
}

export function broadcastSosAlert(sosPayload) {
  if (ioInstance) {
    ioInstance.emit('sos:alert', sosPayload);
  }
}

export function broadcastKpiUpdate(kpiStats) {
  if (ioInstance) {
    ioInstance.emit('kpi:updated', kpiStats);
  }
}

export function broadcastDemoReset(payload) {
  if (ioInstance) {
    ioInstance.emit('demo:reset', payload);
  }
}
