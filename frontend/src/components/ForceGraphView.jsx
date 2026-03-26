import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

function ForceGraphView({ nodes = [], edges = [] }) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 760, height: 360 })

  useEffect(() => {
    const updateDimensions = () => {
      const width = containerRef.current?.clientWidth || 760
      setDimensions({ width: Math.max(320, width), height: 360 })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const graphData = useMemo(
    () => ({
      nodes: (nodes || []).map((node, idx) => ({
        id: String(node.id),
        label: String(node.id),
        colorIndex: idx % 6,
      })),
      links: (edges || []).map((edge) => ({
        source: String(edge.source),
        target: String(edge.target),
        value: Number(edge.weight || 1),
      })),
    }),
    [nodes, edges]
  )

  const nodeColors = ['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#a78bfa', '#ec4899']

  const getNodeColor = (node) => nodeColors[node.colorIndex % nodeColors.length]

  const toCompactLabel = (value) => {
    const text = String(value || '')
    if (text.length <= 8) {
      return text
    }
    return `${text.slice(0, 4)}...${text.slice(-3)}`
  }

  const renderNodeLabel = (node, ctx) => {
    if (!ctx) return

    const label = toCompactLabel(node.id)
    const fontSize = 7

    ctx.save()
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.fillText(label, node.x, node.y)
    ctx.restore()
  }

  if (!graphData.nodes.length) {
    return <p className="muted">No graph connections available.</p>
  }

  return (
    <div className="result-block" ref={containerRef}>
      <h3>Live Graph</h3>
      <div className="graph-wrap force-graph-wrap">
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          cooldownTicks={120}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkColor={() => '#7dd3fc'}
          nodeColor={getNodeColor}
          nodeLabel="label"
          nodeVal={(node) => 10}
          nodeCanvasObject={renderNodeLabel}
          nodeCanvasObjectMode={() => 'after'}
          backgroundColor="rgba(2, 6, 23, 0.85)"
        />
      </div>
    </div>
  )
}

export default ForceGraphView
