import { useState, useEffect, useCallback } from 'react';
import { getEmergencies } from '../services/emergencyService';
import { useSocket } from './useSocket';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export function useEmergencies(params = {}) {
  const [emergencies, setEmergencies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  const fetchEmergencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmergencies(params);
      setEmergencies(data.records);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  useEffect(() => {
    if (!socket) return;

    function handleEmergencyNew(emergency) {
      setEmergencies((prev) => [emergency, ...prev]);
      if (pagination) {
        setPagination((prev) =>
          prev ? { ...prev, total: prev.total + 1, pages: Math.ceil((prev.total + 1) / prev.limit) } : prev
        );
      }
    }

    function handleEmergencyResolved(emergency) {
      setEmergencies((prev) =>
        prev.map((e) => (e._id === emergency._id ? { ...e, status: 'resolved', resolvedAt: emergency.resolvedAt } : e))
      );
    }

    socket.on(SOCKET_EVENTS.EMERGENCY_NEW, handleEmergencyNew);
    socket.on(SOCKET_EVENTS.EMERGENCY_RESOLVED, handleEmergencyResolved);

    return () => {
      socket.off(SOCKET_EVENTS.EMERGENCY_NEW, handleEmergencyNew);
      socket.off(SOCKET_EVENTS.EMERGENCY_RESOLVED, handleEmergencyResolved);
    };
  }, [socket, pagination]);

  return { emergencies, pagination, loading, error, refetch: fetchEmergencies };
}
