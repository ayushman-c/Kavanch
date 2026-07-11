import PageHeader from '../../components/layout/PageHeader/PageHeader';
import AlertList from '../../components/alerts/AlertList';
import { useAlerts } from '../../hooks/useAlerts';
import { Skeleton } from '../../components/common/Skeleton';

export default function Alerts() {
  const { alerts, pagination, loading, error, refetch } = useAlerts();

  return (
    <div className="fade-in">
      <PageHeader title="Alerts" subtitle="Monitor all helmet alerts" />

      <div className="page-toolbar">
        <div className="page-toolbar__left">
          {pagination && (
            <span className="page-toolbar__count">
              {pagination.total} alert{pagination.total !== 1 ? 's' : ''}
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
        <Skeleton type="table" count={6} />
      ) : (
        <AlertList alerts={alerts} loading={false} error={error} onRetry={refetch} />
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
