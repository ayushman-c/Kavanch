import { AlertCircle } from 'lucide-react';

export default function ErrorState({ title = 'Error loading data', message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <AlertCircle size={20} />
      </div>
      <h3 className="error-state__title">{title}</h3>
      {message && <p className="error-state__message">{message}</p>}
      {onRetry && (
        <button className="btn btn--primary btn--sm" onClick={onRetry} type="button">
          Try Again
        </button>
      )}
    </div>
  );
}
