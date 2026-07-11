import { memo } from 'react';

function PageHeader({ title, subtitle, meta }) {
  return (
    <div className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      {meta && meta.length > 0 && (
        <div className="page-header__meta">
          {meta.map((item, i) => (
            <div key={i} className="page-header__meta-item">
              {item.dot && <span className="page-header__meta-dot" style={{ background: item.dot }} />}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(PageHeader);
