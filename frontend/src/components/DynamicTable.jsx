function DynamicTable({ data, title }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="muted">No rows available.</p>
  }

  const columns = Array.from(
    data.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key))
      return set
    }, new Set())
  )

  return (
    <div className="result-block">
      {title && <h3>{title}</h3>}
      <div className="table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((column) => (
                  <td key={`${idx}-${column}`}>{formatValue(row?.[column])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

export default DynamicTable
