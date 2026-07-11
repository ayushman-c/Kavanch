import { useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import HelmetInfo from '../../components/helmet/HelmetInfo';
import SensorGrid from '../../components/helmet/SensorGrid';
import HelmetMap from '../../components/map/HelmetMap';
import AlertList from '../../components/alerts/AlertList';
import EmergencyList from '../../components/emergency/EmergencyList';
import { Skeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import { useHelmet } from '../../hooks/useHelmet';
import { formatTime } from '../../utils/formatDate';

export default function HelmetDetails() {
  const { helmetId } = useParams();
  const { helmet, telemetry, history, loading, error, refetch } = useHelmet(helmetId);

  if (error) return <ErrorState title="Failed to load helmet" message={error} onRetry={refetch} />;
  if (!helmet && !loading) return <ErrorState title="Helmet not found" message="No helmet found with this ID." />;

  const alertArray = helmet?.activeAlerts || [];
  const emergencyObj = helmet?.activeEmergency;

  return (
    <div className="fade-in">
      <PageHeader
        title={`Helmet ${helmetId}`}
        subtitle={helmet?.minerName || 'Unassigned'}
      />

      {loading ? (
        <>
          <div className="skeleton" style={{ height: 180, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 140 }} />
        </>
      ) : (
        <div className="helmet-details__grid">
          <div className="helmet-details__left">
            <HelmetInfo helmet={helmet} />
            <div className="helmet-details__section">
              <h3 className="section-title">Current Telemetry</h3>
              <SensorGrid telemetry={telemetry} />
            </div>
            {telemetry?.latitude != null && telemetry?.longitude != null && (
              <div className="helmet-details__section">
                <h3 className="section-title">GPS Position</h3>
                <HelmetMap
                  helmets={[
                    {
                      helmetId,
                      minerName: helmet?.minerName,
                      deviceStatus: helmet?.deviceStatus,
                      currentTelemetry: telemetry,
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="helmet-details__right">
            {emergencyObj && (
              <div className="helmet-details__section">
                <h3 className="section-title">Active Emergency</h3>
                <EmergencyList emergencies={[emergencyObj]} />
              </div>
            )}

            {alertArray.length > 0 && (
              <div className="helmet-details__section">
                <h3 className="section-title">Active Alerts ({alertArray.length})</h3>
                <AlertList alerts={alertArray} loading={false} />
              </div>
            )}

            <div className="helmet-details__section">
              <h3 className="section-title">Recent Telemetry</h3>
              {history.length === 0 ? (
                <div className="empty-state__message" style={{ padding: '24px 0', textAlign: 'center' }}>
                  No historical telemetry data.
                </div>
              ) : (
                <div className="telemetry-history">
                  {history.map((entry, i) => (
                    <div key={entry._id || i} className="telemetry-item">
                      <div className="telemetry-item__header">
                        <span className="telemetry-item__time">
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                      <div className="telemetry-item__grid">
                        <div className="telemetry-item__field">
                          <span className="telemetry-item__label">HR</span>
                          <span className="telemetry-item__value">{entry.heartRate ?? '—'}</span>
                        </div>
                        <div className="telemetry-item__field">
                          <span className="telemetry-item__label">SpO₂</span>
                          <span className="telemetry-item__value">{entry.spo2 ?? '—'}%</span>
                        </div>
                        <div className="telemetry-item__field">
                          <span className="telemetry-item__label">Temp</span>
                          <span className="telemetry-item__value">{entry.bodyTemperature ?? '—'}°C</span>
                        </div>
                        <div className="telemetry-item__field">
                          <span className="telemetry-item__label">Gas</span>
                          <span className="telemetry-item__value">{entry.gasLevel ?? '—'}ppm</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
