import EmergencyItem from './EmergencyItem';
import Loading from '../common/Loading';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';
import { TriangleAlert } from 'lucide-react';

export default function EmergencyList({ emergencies, loading, error, onRetry }) {
  if (loading) return <Loading message="Loading emergencies..." />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!emergencies || emergencies.length === 0) return <EmptyState title="No emergencies" message="No emergencies recorded." icon={<TriangleAlert size={20} />} />;

  return (
    <div className="emergency-list">
      {emergencies.map((emergency) => (
        <EmergencyItem key={emergency._id} emergency={emergency} />
      ))}
    </div>
  );
}
