import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ChatHistoryPanel from '../components/ChatHistoryPanel'
import DynamicTable from '../components/DynamicTable'
import GraphView from '../components/GraphView'
import ReportCard from '../components/ReportCard'
import SectionBlock from '../components/SectionBlock'
import { sendChatMessage, uploadDataset } from '../api/client'
import { LANGUAGE_CODES, translateFromEnglish, translateToEnglish } from '../api/translate'

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada']
const COMMANDS = [
  { label: 'Show movement', prompt: 'show movement of 1' },
  { label: 'Frequent calls', prompt: 'frequent calls of 1' },
  { label: 'Link', prompt: 'link analysis of 1' },
  { label: 'Common', prompt: 'common contacts between 1 and 2' },
  { label: 'Crime', prompt: 'crime 1' },
]

const SPEECH_LOCALES = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Tamil: 'ta-IN',
  Kannada: 'kn-IN',
}

const SPEECH_LANG_CODES = {
  English: 'en',
  Hindi: 'hi',
  Telugu: 'te',
  Tamil: 'ta',
  Kannada: 'kn',
}

const SPEECH_LANGUAGE_HINTS = {
  English: ['english'],
  Hindi: ['hindi'],
  Telugu: ['telugu'],
  Tamil: ['tamil'],
  Kannada: ['kannada'],
}

const SECTION_LABELS = {
  English: {
    keyObservations: 'Key Observations',
    details: 'Details',
    nextSteps: 'Next Steps',
  },
  Hindi: {
    keyObservations: 'मुख्य अवलोकन',
    details: 'विवरण',
    nextSteps: 'अगले चरण',
  },
  Telugu: {
    keyObservations: 'ముఖ్య పరిశీలనలు',
    details: 'వివరాలు',
    nextSteps: 'తదుపరి దశలు',
  },
  Tamil: {
    keyObservations: 'முக்கிய அவதானிப்புகள்',
    details: 'விவரங்கள்',
    nextSteps: 'அடுத்த படிகள்',
  },
  Kannada: {
    keyObservations: 'ಮುಖ್ಯ ಗಮನಿಕೆಗಳು',
    details: 'ವಿವರಗಳು',
    nextSteps: 'ಮುಂದಿನ ಹಂತಗಳು',
  },
}

function parseExplanationSections(explanation = '') {
  if (!explanation) {
    return { keyObservations: [], details: [], nextSteps: [] }
  }

  const lines = explanation.split('\n').map((line) => line.trim())
  const keyObservations = []
  const details = []
  const nextSteps = []
  let active = ''

  for (const line of lines) {
    const normalized = line.toLowerCase()
    if (normalized.includes('key observations')) {
      active = 'obs'
      continue
    }
    if (normalized.includes('details')) {
      active = 'details'
      continue
    }
    if (normalized.includes('next steps')) {
      active = 'next'
      continue
    }
    if (!line) {
      continue
    }

    const bullet = line
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .replace(/^\*\*(.+)\*\*$/, '$1')

    if (active === 'obs' && bullet) {
      keyObservations.push(bullet)
    }
    if (active === 'details' && bullet) {
      details.push(bullet)
    }
    if (active === 'next' && bullet) {
      nextSteps.push(bullet)
    }
  }

  return { keyObservations, details, nextSteps }
}

async function translateSectionItems(items, selectedLanguage) {
  if (!items.length) {
    return []
  }

  const translated = await Promise.all(
    items.map(async (item) => {
      const localized = await translateFromEnglish(item, selectedLanguage)
      return localized || item
    })
  )
  return translated
}

function cleanMarkdownForChat(text = '') {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function Analysis() {
  const [file, setFile] = useState(null)
  const [datasetType, setDatasetType] = useState('CDR')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadMessageType, setUploadMessageType] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatResponse, setChatResponse] = useState(null)
  const [rawEnglishExplanation, setRawEnglishExplanation] = useState('')
  const [localizedSections, setLocalizedSections] = useState({
    keyObservations: [],
    details: [],
    nextSteps: [],
  })
  const [chatError, setChatError] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [isListening, setIsListening] = useState(false)
  const [voices, setVoices] = useState([])
  const recognitionRef = useRef(null)
  const currentAudioRef = useRef(null)
  const remoteSpeakTokenRef = useRef(0)
  const translationCacheRef = useRef(new Map())

  const translateFromEnglishCached = async (text, language) => {
    const sourceText = (text || '').trim()
    if (!sourceText || language === 'English') {
      return sourceText
    }

    const cacheKey = `${language}::${sourceText}`
    if (translationCacheRef.current.has(cacheKey)) {
      return translationCacheRef.current.get(cacheKey)
    }

    const translated = await translateFromEnglish(sourceText, language)
    const value = translated || sourceText
    translationCacheRef.current.set(cacheKey, value)
    return value
  }

  useEffect(() => {
    if (!window.speechSynthesis) {
      return
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices() || []
      setVoices(availableVoices)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    const applyTranslationForCurrentResponse = async () => {
      if (!rawEnglishExplanation) {
        setLocalizedSections({ keyObservations: [], details: [], nextSteps: [] })
        return
      }

      const englishSections = parseExplanationSections(rawEnglishExplanation)
      const hasSections =
        englishSections.keyObservations.length > 0 ||
        englishSections.details.length > 0 ||
        englishSections.nextSteps.length > 0

      let translatedExplanation = rawEnglishExplanation

      if (hasSections) {
        const [keyObservations, details, nextSteps] = await Promise.all([
          Promise.all(
            englishSections.keyObservations.map((item) =>
              translateFromEnglishCached(item, selectedLanguage)
            )
          ),
          Promise.all(
            englishSections.details.map((item) =>
              translateFromEnglishCached(item, selectedLanguage)
            )
          ),
          Promise.all(
            englishSections.nextSteps.map((item) =>
              translateFromEnglishCached(item, selectedLanguage)
            )
          ),
        ])

        const translatedSections = {
          keyObservations,
          details,
          nextSteps,
        }

        const labels = SECTION_LABELS[selectedLanguage] || SECTION_LABELS.English
        translatedExplanation = [
          translatedSections.keyObservations.length
            ? `${labels.keyObservations}\n${translatedSections.keyObservations.map((item) => `- ${item}`).join('\n')}`
            : '',
          translatedSections.details.length
            ? `${labels.details}\n${translatedSections.details.map((item) => `- ${item}`).join('\n')}`
            : '',
          translatedSections.nextSteps.length
            ? `${labels.nextSteps}\n${translatedSections.nextSteps.map((item) => `- ${item}`).join('\n')}`
            : '',
        ]
          .filter(Boolean)
          .join('\n\n')

        if (!isCancelled) {
          setLocalizedSections(translatedSections)
        }
      } else if (!isCancelled) {
        setLocalizedSections({ keyObservations: [], details: [], nextSteps: [] })
        translatedExplanation = await translateFromEnglishCached(rawEnglishExplanation, selectedLanguage)
      }

      if (isCancelled) {
        return
      }

      setChatResponse((prev) => (prev ? { ...prev, explanation: translatedExplanation } : prev))

      setChatHistory((prev) => {
        const next = [...prev]
        for (let i = next.length - 1; i >= 0; i -= 1) {
          if (next[i].role === 'assistant') {
            next[i] = {
              ...next[i],
              text: cleanMarkdownForChat(translatedExplanation) || 'No explanation returned.',
            }
            break
          }
        }
        return next
      })
    }

    applyTranslationForCurrentResponse()

    return () => {
      isCancelled = true
    }
  }, [selectedLanguage, rawEnglishExplanation])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadMessage(`File selected: ${selectedFile.name}`)
      setUploadMessageType('success')
    }
  }

  const handleDatasetTypeChange = (e) => {
    setDatasetType(e.target.value)
  }

  const handleStartAnalysis = async (e) => {
    e.preventDefault()

    if (!file) {
      setUploadMessage('Please select a file before starting upload')
      setUploadMessageType('error')
      return
    }

    setUploadLoading(true)
    setUploadMessage('')

    try {
      const data = await uploadDataset(file, datasetType)

      setUploadMessage(data.message || `Successfully uploaded ${data.rows} rows of ${datasetType} data`)
      setUploadMessageType('success')
      
      setTimeout(() => {
        setFile(null)
        setUploadMessage('')
        document.getElementById('fileInput').value = ''
      }, 2000)
    } catch (error) {
      setUploadMessage('Error uploading file: ' + (error.message || 'Unknown error'))
      setUploadMessageType('error')
      console.error('Upload error:', error)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSendChat = async (e) => {
    e.preventDefault()
    const message = chatInput.trim()
    if (!message) {
      return
    }

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
    }
    setChatHistory((prev) => [...prev, userMsg])
    setChatInput('')
    setChatLoading(true)
    setChatError('')

    try {
      const englishMessage = await translateToEnglish(message, selectedLanguage)
      const response = await sendChatMessage(englishMessage)
      const englishExplanation = response.explanation || ''
      setRawEnglishExplanation(englishExplanation)
      setChatResponse({ ...response, explanation: englishExplanation })

      setChatHistory((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: cleanMarkdownForChat(englishExplanation) || 'No explanation returned.',
        },
      ])
    } catch (error) {
      setChatError(error.message || 'Failed to send message')
      setChatHistory((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: `Error: ${error.message || 'Failed to send message'}`,
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const handleCommandClick = (prompt) => {
    setChatInput(prompt)
  }

  const startSpeechToText = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setChatError('Speech recognition is not supported in this browser.')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.lang = SPEECH_LOCALES[selectedLanguage] || 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        setChatInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }

      recognition.onerror = () => {
        setChatError('Could not capture speech. Please try again.')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch {
      setIsListening(false)
      setChatError('Unable to start speech recognition.')
    }
  }

  const getBestVoiceForLanguage = () => {
    if (!voices.length) {
      return null
    }

    const locale = SPEECH_LOCALES[selectedLanguage] || 'en-US'
    const localeLower = locale.toLowerCase()
    const languageCode = locale.split('-')[0].toLowerCase()
    const languageHints = SPEECH_LANGUAGE_HINTS[selectedLanguage] || []

    const exact = voices.find((voice) => voice.lang?.toLowerCase() === localeLower)
    if (exact) {
      return exact
    }

    const regionMatch = voices.find((voice) => {
      const voiceLang = (voice.lang || '').toLowerCase()
      return voiceLang.startsWith(`${languageCode}-`)
    })
    if (regionMatch) {
      return regionMatch
    }

    const languageByName = voices.find((voice) => {
      const name = (voice.name || '').toLowerCase()
      return languageHints.some((hint) => name.includes(hint))
    })
    if (languageByName) {
      return languageByName
    }

    return null
  }

  const splitSpeechText = (text) => {
    const normalized = (text || '').replace(/\s+/g, ' ').trim()
    if (!normalized) {
      return []
    }

    const sentenceParts = normalized
      .split(/(?<=[.!?;:])\s+/)
      .map((part) => part.trim())
      .filter(Boolean)

    const chunks = []
    let current = ''
    const maxChunkLength = 180

    for (const part of sentenceParts) {
      if (part.length > maxChunkLength) {
        if (current) {
          chunks.push(current)
          current = ''
        }

        for (let i = 0; i < part.length; i += maxChunkLength) {
          chunks.push(part.slice(i, i + maxChunkLength))
        }
        continue
      }

      const next = current ? `${current} ${part}` : part
      if (next.length <= maxChunkLength) {
        current = next
      } else {
        chunks.push(current)
        current = part
      }
    }

    if (current) {
      chunks.push(current)
    }

    return chunks.length ? chunks : [normalized]
  }

  const stopRemoteAudio = () => {
    remoteSpeakTokenRef.current += 1
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
  }

  const playRemoteTTS = async (textChunks, selectedLangCode) => {
    const token = remoteSpeakTokenRef.current
    for (const chunk of textChunks) {
      if (token !== remoteSpeakTokenRef.current) {
        return
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${selectedLangCode}&q=${encodeURIComponent(chunk)}`
      const audio = new Audio(ttsUrl)
      currentAudioRef.current = audio

      await new Promise((resolve) => {
        audio.onended = () => resolve()
        audio.onerror = () => resolve()
        audio.play().catch(() => resolve())
      })
    }

    if (token === remoteSpeakTokenRef.current) {
      currentAudioRef.current = null
    }
  }

  const speakText = (text) => {
    const cleanText = (text || '').trim()
    if (!cleanText || !window.speechSynthesis) {
      return
    }

    const chunks = splitSpeechText(cleanText)
    const bestVoice = getBestVoiceForLanguage()
    const targetLocale = SPEECH_LOCALES[selectedLanguage] || 'en-US'
    const targetLangCode = SPEECH_LANG_CODES[selectedLanguage] || 'en'

    stopRemoteAudio()
    window.speechSynthesis.cancel()

    if (!bestVoice && selectedLanguage !== 'English') {
      playRemoteTTS(chunks, targetLangCode)
      return
    }

    for (const chunk of chunks) {
      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = targetLocale
      if (bestVoice) {
        utterance.voice = bestVoice
      }
      utterance.rate = 1
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSpeakLastResponse = () => {
    const text = reportSpeechText
    speakText(text)
  }

  const handleStopSpeaking = () => {
    stopRemoteAudio()
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  const resultPayload = chatResponse?.result || null
  const graphData = useMemo(() => {
    if (!resultPayload) {
      return null
    }
    if (Array.isArray(resultPayload.nodes) && Array.isArray(resultPayload.edges)) {
      return { nodes: resultPayload.nodes, edges: resultPayload.edges }
    }
    return null
  }, [resultPayload])

  const tableData = useMemo(() => {
    if (!resultPayload) {
      return []
    }
    if (Array.isArray(resultPayload)) {
      return resultPayload
    }
    if (Array.isArray(resultPayload.movement)) {
      return resultPayload.movement
    }
    if (Array.isArray(resultPayload.results)) {
      return resultPayload.results
    }
    if (Array.isArray(resultPayload.common_contacts)) {
      return resultPayload.common_contacts
    }
    if (Array.isArray(resultPayload.nearby_numbers)) {
      return resultPayload.nearby_numbers
    }
    if (Array.isArray(resultPayload.links)) {
      return resultPayload.links
    }
    return []
  }, [resultPayload])

  const hasStructuredSections =
    localizedSections.keyObservations.length > 0 ||
    localizedSections.details.length > 0 ||
    localizedSections.nextSteps.length > 0

  const sectionLabels = SECTION_LABELS[selectedLanguage] || SECTION_LABELS.English

  const reportSpeechText = useMemo(() => {
    if (!chatResponse?.explanation) {
      return ''
    }

    if (hasStructuredSections) {
      const lines = []
      if (localizedSections.keyObservations.length) {
        lines.push(sectionLabels.keyObservations)
        lines.push(...localizedSections.keyObservations)
      }
      if (localizedSections.details.length) {
        lines.push(sectionLabels.details)
        lines.push(...localizedSections.details)
      }
      if (localizedSections.nextSteps.length) {
        lines.push(sectionLabels.nextSteps)
        lines.push(...localizedSections.nextSteps)
      }
      return lines.join('. ')
    }

    return cleanMarkdownForChat(chatResponse.explanation)
  }, [chatResponse, localizedSections, hasStructuredSections, sectionLabels])

  return (
    <div className="analysis-page">
      <div className="analysis-topbar">
        <h1>Forensic Data Analysis & AI Chat</h1>
      </div>

      <section className="analysis-grid">
        <article className="analysis-card">
          <h2>Upload Dataset</h2>
          {uploadMessage && (
            <div className={uploadMessageType === 'success' ? 'success' : 'error'}>
              {uploadMessage}
            </div>
          )}

          <form onSubmit={handleStartAnalysis}>
            <div className="form-group">
              <label htmlFor="datasetType">Dataset Type</label>
              <select
                id="datasetType"
                value={datasetType}
                onChange={handleDatasetTypeChange}
                disabled={uploadLoading}
              >
                <option value="CDR">CDR (Call Detail Records)</option>
                <option value="Tower">Tower Data</option>
                <option value="IPDR">IPDR (IP Detail Records)</option>
                <option value="Crime">Crime Scene Data</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fileInput" className="file-input-label">
                <p>Click to upload forensic dataset</p>
                <p className="muted-text">
                  {file ? `Selected: ${file.name}` : 'Excel files (.xlsx, .xls) supported'}
                </p>
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  disabled={uploadLoading}
                  accept=".xlsx,.xls"
                />
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={uploadLoading || !file}>
              {uploadLoading ? 'Uploading...' : 'Upload Dataset'}
            </button>
          </form>
        </article>

        <article className="analysis-card">
          <h2>AI Chat</h2>
          <div className="command-buttons">
            {COMMANDS.map((command) => (
              <button
                key={command.label}
                type="button"
                className="command-btn"
                onClick={() => handleCommandClick(command.prompt)}
              >
                {command.label}
              </button>
            ))}
          </div>
          <ChatHistoryPanel history={chatHistory} />
          <form className="chat-form" onSubmit={handleSendChat}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask: show movement of 1"
              disabled={chatLoading}
            />
            <button
              type="button"
              className="btn-secondary mic-btn"
              onClick={startSpeechToText}
              disabled={chatLoading || isListening}
            >
              {isListening ? 'Listening...' : 'Mic'}
            </button>
            <button type="submit" className="btn-primary" disabled={chatLoading || !chatInput.trim()}>
              {chatLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
          {chatError && <div className="error">{chatError}</div>}
        </article>
      </section>

      <section className="analysis-results">
        {!chatResponse && (
          <div className="analysis-card">
            <h2>Result</h2>
            <p className="muted">Send a chat query to view analysis results.</p>
          </div>
        )}

        {chatResponse && (
          <ReportCard
            title={graphData ? 'Link Analysis Report' : 'Case Report'}
            subtitle={resultPayload?.number ? `Subject: ${resultPayload.number}` : 'Telecom Forensic Intelligence'}
          >
            <div className="report-actions">
              <div className="language-control report-language-control">
                <label htmlFor="reportLanguageSelector">Language</label>
                <select
                  id="reportLanguageSelector"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn-secondary speak-btn"
                onClick={handleSpeakLastResponse}
                disabled={chatLoading || !reportSpeechText}
              >
                Speak Report
              </button>
              <button
                type="button"
                className="btn-secondary stop-btn"
                onClick={handleStopSpeaking}
              >
                Stop
              </button>
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

            {Array.isArray(tableData) && tableData.length > 0 && (
              <DynamicTable
                title={Array.isArray(resultPayload?.movement) ? 'Movement Timeline' : 'Data Table'}
                data={tableData}
              />
            )}

            {graphData && (
              <div className="result-block">
                <h3>Graph View</h3>
                <GraphView nodes={graphData.nodes} edges={graphData.edges} />
              </div>
            )}
          </ReportCard>
        )}
      </section>
    </div>
  )
}

export default Analysis
