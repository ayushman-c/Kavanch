import { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import EmptyState from '../common/EmptyState';

function TelemetryTrendChart({ telemetry }) {
  const chartData = useMemo(() => {
    if (!telemetry) return [];
    const metrics = ['heartRate', 'spo2', 'bodyTemperature', 'gasLevel', 'batteryLevel'];
    const labels = ['Heart Rate', 'SpO₂', 'Temperature', 'Gas Level', 'Battery'];

    return metrics.map((m, i) => ({
      name: labels[i],
      min: telemetry[m]?.min ?? 0,
      max: telemetry[m]?.max ?? 0,
      avg: telemetry[m]?.avg ?? 0,
    }));
  }, [telemetry]);

  if (!telemetry) return <EmptyState title="No telemetry data" message="No telemetry data for analytics." />;

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Telemetry Trends (Min / Avg / Max)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="min" stroke="#999999" name="Min" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="avg" stroke="#111111" name="Avg" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="max" stroke="#666666" name="Max" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
      {telemetry.packetCount != null && (
        <p className="chart-card__meta">Based on {telemetry.packetCount} telemetry packets</p>
      )}
    </div>
  );
}

export default memo(TelemetryTrendChart);
