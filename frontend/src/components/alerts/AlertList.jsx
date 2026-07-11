import AlertItem from './AlertItem';
import Loading from '../common/Loading';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';
import { Bell } from 'lucide-react';

export default function AlertList({ alerts, loading, error, onRetry }) {
  if (loading) return <Loading message="Loading alerts..." />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!alerts || alerts.length === 0) return <EmptyState title="No alerts" message="No alerts found." icon={<Bell size={20} />} />;

  return (
    <div className="alert-list">
      {alerts.map((alert) => (
        <AlertItem key={alert._id} alert={alert} />
      ))}
    </div>
  );
}
