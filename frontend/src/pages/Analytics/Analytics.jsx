import { useState, useCallback } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import AnalyticsOverview from '../../components/analytics/AnalyticsOverview';
import TelemetryTrendChart from '../../components/analytics/TelemetryTrendChart';
import AlertTrendChart from '../../components/analytics/AlertTrendChart';
import EmergencyTrendChart from '../../components/analytics/EmergencyTrendChart';
import HelmetUsageChart from '../../components/analytics/HelmetUsageChart';
import DateRangeFilter from '../../components/analytics/DateRangeFilter';
import { Skeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function Analytics() {
  const [filters, setFilters] = useState({});
  const { overview, telemetry, alerts, emergencies, loading, error, refetch } = useAnalytics(filters);

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  if (error) return <ErrorState title="Failed to load analytics" message={error} onRetry={refetch} />;

  return (
    <div className="analytics-page fade-in">
      <PageHeader title="Analytics" subtitle="System-wide statistics and trends" />

      <div className="analytics-page__filters">
        <DateRangeFilter onApply={handleFilter} />
      </div>

      {loading ? (
        <>
          <div className="skeleton-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="skeleton skeleton--card" />
            ))}
          </div>
          <div className="analytics-page__charts">
            <div className="skeleton" style={{ height: 350 }} />
            <div className="skeleton" style={{ height: 350 }} />
          </div>
        </>
      ) : (
        <>
          {overview && <AnalyticsOverview overview={overview} />}

          <div className="analytics-page__charts">
            <TelemetryTrendChart telemetry={telemetry} />
            <HelmetUsageChart overview={overview} />
          </div>

          <div className="analytics-page__charts">
            <AlertTrendChart alerts={alerts} />
            <EmergencyTrendChart emergencies={emergencies} />
          </div>
        </>
      )}
    </div>
  );
}
