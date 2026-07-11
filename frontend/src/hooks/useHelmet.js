import { useState, useEffect, useCallback } from 'react';
import { getHelmetById } from '../services/helmetService';
import { getLatestTelemetry, getTelemetryHistory } from '../services/telemetryService';
import { useSocket } from './useSocket';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export function useHelmet(helmetId) {
  const [helmet, setHelmet] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  const fetchHelmet = useCallback(async () => {
    if (!helmetId) return;
    try {
      setLoading(true);
      setError(null);
      const [helmetData, telemetryData] = await Promise.all([
        getHelmetById(helmetId),
        getLatestTelemetry(helmetId).catch(() => null),
      ]);
      setHelmet(helmetData);
      setTelemetry(telemetryData);

      getTelemetryHistory(helmetId, { limit: 20 })
        .then((data) => setHistory(data.records || []))
        .catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [helmetId]);

  useEffect(() => {
    fetchHelmet();
  }, [fetchHelmet]);

  useEffect(() => {
    if (!socket || !helmetId) return;

    function handleTelemetryUpdate(data) {
      if (data.helmetId === helmetId) {
        setTelemetry(data);
        setHistory((prev) => [data, ...prev].slice(0, 50));
      }
    }

    socket.on(SOCKET_EVENTS.TELEMETRY_UPDATE, handleTelemetryUpdate);
    return () => {
      socket.off(SOCKET_EVENTS.TELEMETRY_UPDATE, handleTelemetryUpdate);
    };
  }, [socket, helmetId]);

  return { helmet, telemetry, history, loading, error, refetch: fetchHelmet };
}
