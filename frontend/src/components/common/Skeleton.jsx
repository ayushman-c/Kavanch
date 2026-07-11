import { memo } from 'react';

function SkeletonCards({ count = 4 }) {
  return (
    <div className="skeleton-cards">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton--card" />
      ))}
    </div>
  );
}

function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table__header">
        <div className="skeleton skeleton--heading" style={{ width: '30%' }} />
        <div className="skeleton skeleton--badge" />
      </div>
      <div className="skeleton-table__rows">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="skeleton skeleton--row" />
        ))}
      </div>
    </div>
  );
}

function Skeleton({ type = 'text', count = 1 }) {
  if (type === 'cards') return <SkeletonCards count={count} />;
  if (type === 'table') return <SkeletonTable rows={count} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`skeleton skeleton--${type}`} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCards, SkeletonTable };
export default Skeleton;
