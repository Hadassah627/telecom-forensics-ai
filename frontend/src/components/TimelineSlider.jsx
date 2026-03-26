function formatTimeLabel(value) {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString()
}

function getTimelineTime(item) {
  if (item && typeof item === 'object') {
    return item.time || item.timestamp || item.value || null
  }
  return item
}

function TimelineSlider({ timeline = [], activeIndex = 0, onChange }) {
  if (!Array.isArray(timeline) || timeline.length <= 1) {
    return null
  }

  const safeIndex = Math.max(0, Math.min(activeIndex, timeline.length - 1))

  const activeItem = timeline[safeIndex]
  const activeTower = activeItem && typeof activeItem === 'object' ? activeItem.tower || activeItem.tower_id : null
  const activeLocation = activeItem && typeof activeItem === 'object' ? activeItem.location : null

  return (
    <div className="result-block timeline-block">
      <h3>Timeline</h3>
      <input
        type="range"
        min={0}
        max={timeline.length - 1}
        step={1}
        value={safeIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="timeline-slider"
      />
      <div className="timeline-labels">
        <span>{formatTimeLabel(getTimelineTime(timeline[0]))}</span>
        <strong>{formatTimeLabel(getTimelineTime(activeItem))}</strong>
        <span>{formatTimeLabel(getTimelineTime(timeline[timeline.length - 1]))}</span>
      </div>
      {(activeTower || activeLocation) && (
        <p className="timeline-meta">
          Tower: <strong>{activeTower || '-'}</strong> | Location: <strong>{activeLocation || '-'}</strong>
        </p>
      )}
    </div>
  )
}

export default TimelineSlider
