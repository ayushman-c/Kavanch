import { memo, useState } from 'react';

function DateRangeFilter({ onApply }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function handleApply(e) {
    e.preventDefault();
    onApply?.({ startDate: startDate || undefined, endDate: endDate || undefined });
  }

  function handleClear() {
    setStartDate('');
    setEndDate('');
    onApply?.({});
  }

  return (
    <div className="date-filter">
      <div className="date-filter__field">
        <label htmlFor="filter-start" className="date-filter__label">From</label>
        <input
          id="filter-start"
          type="date"
          className="date-filter__input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Start date"
        />
      </div>
      <div className="date-filter__field">
        <label htmlFor="filter-end" className="date-filter__label">To</label>
        <input
          id="filter-end"
          type="date"
          className="date-filter__input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="End date"
        />
      </div>
      <button type="submit" className="btn btn--primary btn--sm" onClick={handleApply}>
        Apply
      </button>
      <button type="button" className="btn btn--ghost btn--sm" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}

export default memo(DateRangeFilter);
