import { useState, useEffect, useCallback } from 'react';
import {
  getOverview,
  getTelemetryAnalytics,
  getAlertAnalytics,
  getEmergencyAnalytics,
} from '../services/analyticsService';

export function useAnalytics(filters = {}) {
  const [overview, setOverview] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [emergencies, setEmergencies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, tl, al, em] = await Promise.all([
        getOverview(),
        getTelemetryAnalytics(filters),
        getAlertAnalytics(),
        getEmergencyAnalytics(),
      ]);
      setOverview(ov);
      setTelemetry(tl);
      setAlerts(al);
      setEmergencies(em);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { overview, telemetry, alerts, emergencies, loading, error, refetch: fetchAll };
}
