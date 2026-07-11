import PageHeader from '../../components/layout/PageHeader/PageHeader';
import EmergencyList from '../../components/emergency/EmergencyList';
import { useEmergencies } from '../../hooks/useEmergencies';
import { Skeleton } from '../../components/common/Skeleton';

export default function Emergencies() {
  const { emergencies, pagination, loading, error, refetch } = useEmergencies();

  return (
    <div className="fade-in">
      <PageHeader title="Emergencies" subtitle="Critical emergency events" />

      <div className="page-toolbar">
        <div className="page-toolbar__left">
          {pagination && (
            <span className="page-toolbar__count">
              {pagination.total} incident{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="page-toolbar__right">
          <button className="btn btn--secondary btn--sm" onClick={refetch} type="button">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton type="table" count={4} />
      ) : (
        <EmergencyList emergencies={emergencies} loading={false} error={error} onRetry={refetch} />
      )}

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <span className="pagination__info">
            Page {pagination.page} of {pagination.pages}
          </span>
        </div>
      )}
    </div>
  );
}
