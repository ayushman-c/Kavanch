export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="error-state">
      <p className="empty-state__message" style={{ color: 'var(--text-muted)' }}>{message}</p>
    </div>
  );
}
