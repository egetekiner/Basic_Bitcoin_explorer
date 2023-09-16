import React from "react";


export const NumberRangeColumnFilter = ({ column: { filterValue = [], preFilteredRows, setFilter, id } }) => {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
  
      preFilteredRows.forEach(row => {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
      });
  
      return [min, max];
    }, [id, preFilteredRows]);
  
    return (
      <div>
        <input
          type="number"
          value={filterValue[0] || ""}
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
          }}
          placeholder={`Min (${min})`}
        />
        to
        <input
          type="number"
          value={filterValue[1] || ""}
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
          }}
          placeholder={`Max (${max})`}
        />
      </div>
    );
  };
  
  export const DateRangeColumnFilter = ({
    column: { filterValue = [], setFilter, id }
  }) => {
    const [startDate, endDate] = filterValue;
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="date"
          value={startDate || ''}
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [val ? val : undefined, old[1]]);
          }}
          placeholder={`Start Date`}
          style={{
            width: '70%',
            marginBottom: '0.3rem',
          }}
        />
        <input
          type="date"
          value={endDate || ''}
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [old[0], val ? val : undefined]);
          }}
          placeholder={`End Date`}
          style={{
            width: '70%',
          }}
        />
      </div>
    );
  };

  