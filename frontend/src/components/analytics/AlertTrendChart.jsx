import { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import EmptyState from '../common/EmptyState';

const COLORS = ['#111111', '#999999', '#666666', '#E5E5E5', '#F0F0F0'];

function AlertTrendChart({ alerts }) {
  const byTypeData = useMemo(() => {
    if (!alerts?.byType) return [];
    return Object.entries(alerts.byType).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  const bySeverityData = useMemo(() => {
    if (!alerts?.bySeverity) return [];
    return Object.entries(alerts.bySeverity).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  const byStatusData = useMemo(() => {
    if (!alerts?.byStatus) return [];
    return Object.entries(alerts.byStatus).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  if (!alerts) return <EmptyState title="No alert analytics" message="No alert analytics data." />;

  const renderPie = (data, title) => (
    <div className="chart-card__pie">
      <h4 className="chart-card__subtitle">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={30}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Alert Breakdown</h3>
      <div className="chart-card__pies">
        {byTypeData.length > 0 && renderPie(byTypeData, 'By Type')}
        {bySeverityData.length > 0 && renderPie(bySeverityData, 'By Severity')}
        {byStatusData.length > 0 && renderPie(byStatusData, 'By Status')}
      </div>
    </div>
  );
}

export default memo(AlertTrendChart);
