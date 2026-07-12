import { useState, useEffect, useCallback } from 'react';
import { getDashboardLive } from '../services/dashboardService';
import api from '../services/api';
import { useSocket } from './useSocket';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export function useDashboard() {
  const [liveData, setLiveData] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected } = useSocket();

  const fetchLiveData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardLive();
      setLiveData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await api.get('/health');
      if (res.data.success) setHealth(res.data.data);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth, isConnected]);

  useEffect(() => {
    if (!socket) return;

    function handleTelemetryUpdate(telemetry) {
      setLiveData((prev) =>
        prev.map((h) =>
          h.helmetId === telemetry.helmetId
            ? { ...h, currentTelemetry: telemetry }
            : h
        )
      );
    }

    function handleAlertNew(alert) {
      setLiveData((prev) =>
        prev.map((h) =>
          h.helmetId === alert.helmetId
            ? { ...h, activeAlerts: [alert, ...(h.activeAlerts || [])] }
            : h
        )
      );
    }

    function handleAlertResolved(alert) {
      setLiveData((prev) =>
        prev.map((h) =>
          h.helmetId === alert.helmetId
            ? {
                ...h,
                activeAlerts: (h.activeAlerts || []).map((a) =>
                  a._id === alert._id ? { ...a, status: 'resolved' } : a
                ),
              }
            : h
        )
      );
    }

    function handleEmergencyNew(emergency) {
      setLiveData((prev) =>
        prev.map((h) =>
          h.helmetId === emergency.helmetId ? { ...h, activeEmergency: emergency } : h
        )
      );
    }

    function handleEmergencyResolved(emergency) {
      setLiveData((prev) =>
        prev.map((h) =>
          h.helmetId === emergency.helmetId
            ? h.activeEmergency?._id === emergency._id
              ? { ...h, activeEmergency: null }
              : h
            : h
        )
      );
    }

    socket.on(SOCKET_EVENTS.TELEMETRY_UPDATE, handleTelemetryUpdate);
    socket.on(SOCKET_EVENTS.ALERT_NEW, handleAlertNew);
    socket.on(SOCKET_EVENTS.ALERT_RESOLVED, handleAlertResolved);
    socket.on(SOCKET_EVENTS.EMERGENCY_NEW, handleEmergencyNew);
    socket.on(SOCKET_EVENTS.EMERGENCY_RESOLVED, handleEmergencyResolved);

    return () => {
      socket.off(SOCKET_EVENTS.TELEMETRY_UPDATE, handleTelemetryUpdate);
      socket.off(SOCKET_EVENTS.ALERT_NEW, handleAlertNew);
      socket.off(SOCKET_EVENTS.ALERT_RESOLVED, handleAlertResolved);
      socket.off(SOCKET_EVENTS.EMERGENCY_NEW, handleEmergencyNew);
      socket.off(SOCKET_EVENTS.EMERGENCY_RESOLVED, handleEmergencyResolved);
    };
  }, [socket]);

  const latestTelemetry = liveData
    .filter((h) => h.currentTelemetry)
    .map((h) => h.currentTelemetry)
    .slice(0, 10);

  const activeAlertsList = liveData
    .flatMap((h) => h.activeAlerts || [])
    .filter((a) => a.status === 'active')
    .slice(0, 5);

  const activeEmergenciesList = liveData
    .filter((h) => h.activeEmergency)
    .map((h) => h.activeEmergency)
    .slice(0, 5);

  const helmetsWithTelemetry = liveData.filter((h) => h.currentTelemetry);

  const avgGasLevel = helmetsWithTelemetry.length
    ? Math.round(helmetsWithTelemetry.reduce((s, h) => s + (h.currentTelemetry.gasLevel ?? 0), 0) / helmetsWithTelemetry.length)
    : null;

  const avgHeartRate = helmetsWithTelemetry.length
    ? Math.round(helmetsWithTelemetry.reduce((s, h) => s + (h.currentTelemetry.heartRate ?? 0), 0) / helmetsWithTelemetry.length)
    : null;

  const avgBattery = liveData.filter((h) => h.batteryLevel != null).length
    ? Math.round(liveData.reduce((s, h) => s + (h.batteryLevel ?? 0), 0) / liveData.filter((h) => h.batteryLevel != null).length)
    : null;

  const summaryCardsData = health
    ? {
        totalHelmets: liveData.length,
        onlineHelmets: liveData.filter((h) => h.deviceStatus === 'online').length,
        activeAlerts: activeAlertsList.length,
        totalAlerts: '—',
        activeEmergencies: activeEmergenciesList.length,
        totalEmergencies: '—',
        averageGasLevel: avgGasLevel,
        averageHeartRate: avgHeartRate,
        averageBatteryLevel: avgBattery,
        database: health.database,
        server: health.server,
      }
    : null;

  return {
    liveData,
    latestTelemetry,
    activeAlertsList,
    activeEmergenciesList,
    summaryCardsData,
    health,
    loading,
    error,
    refetch: fetchLiveData,
  };
}
