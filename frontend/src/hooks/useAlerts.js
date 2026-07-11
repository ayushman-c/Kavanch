import { useState, useEffect, useCallback } from 'react';
import { getAlerts } from '../services/alertService';
import { useSocket } from './useSocket';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export function useAlerts(params = {}) {
  const [alerts, setAlerts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAlerts(params);
      setAlerts(data.records);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (!socket) return;

    function handleAlertNew(alert) {
      setAlerts((prev) => [alert, ...prev]);
      if (pagination) {
        setPagination((prev) =>
          prev ? { ...prev, total: prev.total + 1, pages: Math.ceil((prev.total + 1) / prev.limit) } : prev
        );
      }
    }

    function handleAlertResolved(alert) {
      setAlerts((prev) =>
        prev.map((a) => (a._id === alert._id ? { ...a, status: 'resolved' } : a))
      );
    }

    socket.on(SOCKET_EVENTS.ALERT_NEW, handleAlertNew);
    socket.on(SOCKET_EVENTS.ALERT_RESOLVED, handleAlertResolved);

    return () => {
      socket.off(SOCKET_EVENTS.ALERT_NEW, handleAlertNew);
      socket.off(SOCKET_EVENTS.ALERT_RESOLVED, handleAlertResolved);
    };
  }, [socket, pagination]);

  return { alerts, pagination, loading, error, refetch: fetchAlerts };
}
