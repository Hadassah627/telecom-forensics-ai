import ReactMarkdown from 'react-markdown'

function SectionBlock({ title, items = [] }) {
  if (!items.length) {
    return null
  }

  return (
    <section className="section-block">
      <h3 className="section-title">{title}</h3>
      <ul>
        {items.map((item, idx) => (
          <li className="section-item" key={`${title}-${idx}`}>
            <ReactMarkdown>{item}</ReactMarkdown>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SectionBlock
