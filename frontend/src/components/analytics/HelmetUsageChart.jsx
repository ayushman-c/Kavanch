import { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#111111', '#999999', '#666666', '#E5E5E5'];

function HelmetUsageChart({ overview }) {
  const data = useMemo(() => {
    if (!overview) return [];
    return [
      { name: 'Online', value: overview.onlineHelmets || 0 },
      { name: 'Offline', value: overview.offlineHelmets || 0 },
    ];
  }, [overview]);

  if (!overview || data.every((d) => d.value === 0)) return null;

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Helmet Usage</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(HelmetUsageChart);
