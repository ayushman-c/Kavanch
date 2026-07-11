import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data available', message, icon }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon ? icon : <Inbox size={22} />}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
    </div>
  );
}
