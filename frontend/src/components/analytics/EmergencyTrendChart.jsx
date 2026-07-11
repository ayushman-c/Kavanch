import { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import EmptyState from '../common/EmptyState';

const COLORS = ['#111111', '#999999', '#666666', '#E5E5E5'];

function EmergencyTrendChart({ emergencies }) {
  const byTypeData = useMemo(() => {
    if (!emergencies?.byType) return [];
    return Object.entries(emergencies.byType).map(([name, value]) => ({ name, value }));
  }, [emergencies]);

  const byStatusData = useMemo(() => {
    if (!emergencies?.byStatus) return [];
    return Object.entries(emergencies.byStatus).map(([name, value]) => ({ name, value }));
  }, [emergencies]);

  if (!emergencies) return <EmptyState title="No emergency analytics" message="No emergency analytics data." />;

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Emergency Breakdown</h3>
      <div className="chart-card__pies">
        {byTypeData.length > 0 && (
          <div className="chart-card__pie">
            <h4 className="chart-card__subtitle">By Type</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={byTypeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#111111" fill="#111111" fillOpacity={0.08} name="Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {byStatusData.length > 0 && (
          <div className="chart-card__pie">
            <h4 className="chart-card__subtitle">By Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={byStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={30}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {byStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(EmergencyTrendChart);
