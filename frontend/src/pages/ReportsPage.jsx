import React from 'react'
import ReportCard from '../components/ReportCard'
import SectionBlock from '../components/SectionBlock'
import RiskAlert from '../components/RiskAlert'
import TimelineSlider from '../components/TimelineSlider'
import MapView from '../components/MapView'
import ForceGraphView from '../components/ForceGraphView'
import DynamicTable from '../components/DynamicTable'
import ReactMarkdown from 'react-markdown'

export default function ReportsPage({
  chatResponse,
  caseMessage,
  caseMessageType,
  localizedSections,
  hasStructuredSections,
  sectionLabels,
  selectedLanguage,
  setSelectedLanguage,
  handleSaveCase,
  handleOpenCaseModal,
  handleOpenHistoryModal,
  handleExportPdf,
  handleSpeakLastResponse,
  handleStopSpeaking,
  reportSpeechText,
  resultPayload,
  graphData,
  suspectNumbers,
  timelineData,
  timelineIndex,
  setTimelineIndex,
  mapRows,
  filteredTableData,
  reportRef,
  languageOptions = [],
}) {
  if (!chatResponse) {
    return (
      <div className="analysis-card">
        <h2>Result</h2>
        <p className="muted">Send a chat query to view analysis results.</p>
      </div>
    )
  }

  return (
    <div ref={reportRef}>
      {caseMessage && <div className={caseMessageType === 'success' ? 'success' : 'error'} style={{ marginBottom: '16px' }}>{caseMessage}</div>}
      <ReportCard
        title={graphData ? 'Link Analysis Report' : 'Case Report'}
        subtitle={resultPayload?.number ? `Subject: ${resultPayload.number}` : 'Telecom Forensic Intelligence'}
      >
        <div className="report-actions">
          <div className="language-control report-language-control">
            <label htmlFor="reportLanguageSelector">Language</label>
            <select id="reportLanguageSelector" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <button type="button" className="btn-secondary" onClick={handleSaveCase}>Save Case</button>
          <button type="button" className="btn-secondary" onClick={handleOpenCaseModal}>Load Case</button>
          <button type="button" className="btn-secondary" onClick={handleOpenHistoryModal}>History</button>
          <button type="button" className="btn-secondary" onClick={handleExportPdf}>Export PDF</button>
          <button type="button" className="btn-secondary speak-btn" onClick={() => void handleSpeakLastResponse()} disabled={!reportSpeechText}>Speak Report</button>
          <button type="button" className="btn-secondary stop-btn" onClick={handleStopSpeaking}>Stop</button>
        </div>

        {hasStructuredSections ? (
          <>
            <SectionBlock title={sectionLabels.keyObservations} items={localizedSections.keyObservations} />
            <SectionBlock title={sectionLabels.details} items={localizedSections.details} />
            <SectionBlock title={sectionLabels.nextSteps} items={localizedSections.nextSteps} />
          </>
        ) : (
          <div className="explanation">
            <ReactMarkdown>{chatResponse.explanation}</ReactMarkdown>
          </div>
        )}

        <RiskAlert riskLevel={resultPayload?.risk_level || 'LOW'} reasons={resultPayload?.risk_reason || []} />

        {suspectNumbers.length > 0 && (
          <div className="suspect-badges">
            <p className="suspect-title">Suspect Highlights</p>
            <div className="suspect-badge-wrap">
              {suspectNumbers.map((item) => (
                <span key={item} className="suspect-badge">{item}</span>
              ))}
            </div>
          </div>
        )}

        <TimelineSlider timeline={timelineData} activeIndex={timelineIndex} onChange={setTimelineIndex} />

        <MapView towerData={{ towers: mapRows }} />

        {graphData && (
          <ForceGraphView nodes={graphData.nodes} edges={graphData.edges} mainNumber={resultPayload?.number || ''} suspectNumbers={suspectNumbers} />
        )}

        {Array.isArray(filteredTableData) && filteredTableData.length > 0 && (
          <DynamicTable title={Array.isArray(resultPayload?.movement) ? 'Movement Timeline' : 'Data Table'} data={filteredTableData} suspectNumbers={suspectNumbers} />
        )}
      </ReportCard>
    </div>
  )
}
