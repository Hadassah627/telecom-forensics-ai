function GraphView({ nodes = [], edges = [] }) {
  if (!Array.isArray(nodes) || !Array.isArray(edges) || nodes.length === 0) {
    return <p className="muted">No graph connections available.</p>
  }

  const width = 760
  const height = 320
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.max(90, Math.min(width, height) / 2 - 60)

  const positions = nodes.map((node, idx) => {
    const angle = (2 * Math.PI * idx) / nodes.length
    return {
      id: node.id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  const posMap = new Map(positions.map((p) => [p.id, p]))

  return (
    <div className="result-block">
      <h3>Connection Graph</h3>
      <div className="graph-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="graph-svg" role="img" aria-label="Link graph">
          {edges.map((edge, idx) => {
            const source = posMap.get(edge.source)
            const target = posMap.get(edge.target)
            if (!source || !target) {
              return null
            }
            return (
              <line
                key={`edge-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#7a8a99"
                strokeWidth={Math.min(5, 1 + Number(edge.weight || 1))}
                strokeOpacity="0.7"
              />
            )
          })}

          {positions.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="16" fill="#136f63" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fff" fontSize="9">
                {String(node.id).slice(-4)}
              </text>
              <text x={node.x} y={node.y - 22} textAnchor="middle" fill="#1f2933" fontSize="10">
                {String(node.id)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default GraphView
