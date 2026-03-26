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

function TimelineSlider({ timeline = [], activeIndex = 0, onChange }) {
  if (!Array.isArray(timeline) || timeline.length <= 1) {
    return null
  }

  const safeIndex = Math.max(0, Math.min(activeIndex, timeline.length - 1))

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
        <span>{formatTimeLabel(timeline[0])}</span>
        <strong>{formatTimeLabel(timeline[safeIndex])}</strong>
        <span>{formatTimeLabel(timeline[timeline.length - 1])}</span>
      </div>
    </div>
  )
}

export default TimelineSlider
