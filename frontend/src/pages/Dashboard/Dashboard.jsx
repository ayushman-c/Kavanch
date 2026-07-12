import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import MetricCards from '../../components/dashboard/MetricCards/MetricCards';
import HelmetTable from '../../components/dashboard/HelmetTable/HelmetTable';
import LiveTelemetry from '../../components/dashboard/LiveTelemetry/LiveTelemetry';
import SignalPanel from '../../components/dashboard/SignalPanel/SignalPanel';
import AlertItem from '../../components/alerts/AlertItem';
import EmergencyItem from '../../components/emergency/EmergencyItem';
import { Skeleton, SkeletonCards, SkeletonTable } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import HelmetMap from '../../components/map/HelmetMap';
import { useDashboard } from '../../hooks/useDashboard';
import { buildHelmetPath } from '../../constants/routes';
import { Clock, HardHat } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    liveData,
    latestTelemetry,
    activeAlertsList,
    activeEmergenciesList,
    summaryCardsData,
    loading,
    error,
    refetch,
  } = useDashboard();

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Live mining helmet monitoring" />
        <ErrorState title="Failed to load dashboard" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <PageHeader
          title="Dashboard"
          subtitle="Live mining helmet monitoring"
          meta={[
            { label: new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }), dot: 'var(--success)' },
            { label: 'All systems normal', dot: 'var(--success)' },
          ]}
        />
        <div className="dashboard-hero__status">
          <div className="dashboard-hero__chip">
            <Clock size={14} />
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
          <div className="dashboard-hero__chip">
            <HardHat size={14} />
            {summaryCardsData?.onlineHelmets ?? '—'} online
          </div>
        </div>
      </div>

      {loading ? (
        <>
          <SkeletonCards count={4} />
          <SkeletonTable rows={5} />
        </>
      ) : (
        <>
          <MetricCards summary={summaryCardsData} />

          <div className="dashboard-grid">
            <div className="dashboard-grid__main">
              <HelmetTable
                helmets={liveData}
                onHelmetClick={(helmetId) => navigate(buildHelmetPath(helmetId))}
              />
              <HelmetMap helmets={liveData} />
            </div>

            <div className="dashboard-grid__side">
              {loading ? (
                <div className="skeleton skeleton--card" style={{ height: 300 }} />
              ) : (
                <LiveTelemetry telemetry={latestTelemetry} />
              )}

              <SignalPanel helmets={liveData} />

              {/* Activity Feed */}
              <div className="activity-feed" style={{ marginTop: 24 }}>
                <div className="activity-feed__header">
                  <span className="activity-feed__title">Activity</span>
                </div>
                <div className="activity-feed__list">
                  {activeEmergenciesList.length === 0 && activeAlertsList.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                      No recent activity
                    </div>
                  ) : (
                    <>
                      {activeEmergenciesList.map((em) => (
                        <div key={em._id} className="activity-item">
                          <span className="activity-item__dot activity-item__dot--emergency" />
                          <div className="activity-item__content">
                            <div className="activity-item__title">{em.emergencyType}</div>
                            <div className="activity-item__description">{em.helmetId}</div>
                          </div>
                        </div>
                      ))}
                      {activeAlertsList.map((al) => (
                        <div key={al._id} className="activity-item">
                          <span className={`activity-item__dot ${al.severity === 'critical' || al.severity === 'high' ? 'activity-item__dot--emergency' : 'activity-item__dot--alert'}`} />
                          <div className="activity-item__content">
                            <div className="activity-item__title">{al.type}</div>
                            <div className="activity-item__description">{al.helmetId} — {al.message}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
