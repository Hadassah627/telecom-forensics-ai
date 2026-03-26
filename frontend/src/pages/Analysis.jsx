import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ChatHistoryPanel from '../components/ChatHistoryPanel'
import CaseListModal from '../components/CaseListModal'
import DynamicTable from '../components/DynamicTable'
import ForceGraphView from '../components/ForceGraphView'
import HistoryModal from '../components/HistoryModal'
import MapView from '../components/MapView'
import RiskAlert from '../components/RiskAlert'
import ReportCard from '../components/ReportCard'
import SectionBlock from '../components/SectionBlock'
import TimelineSlider from '../components/TimelineSlider'
import {
  addHistoryItem,
  clearAllSessions,
  createSession,
  getSessionHistory,
  listCases,
  listSessions,
  loadCase,
  saveCase,
  sendChatMessage,
  uploadDataset,
} from '../api/client'
import { translateFromEnglish, translateToEnglish } from '../api/translate'

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

function extractTimeField(row = {}) {
  return row.time || row.timestamp || row.date_time || row.datetime || null
}

function summarizeExplanation(explanation = '') {
  const lines = String(explanation)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.slice(0, 2).join(' ') || 'No summary available.'
}

function toEpoch(value) {
  if (!value) {
    return null
  }
  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) {
    return date.getTime()
  }
  const maybeNumber = Number(value)
  return Number.isFinite(maybeNumber) ? maybeNumber : null
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
  const [caseMessage, setCaseMessage] = useState('')
  const [caseMessageType, setCaseMessageType] = useState('')
  const [savedCases, setSavedCases] = useState([])
  const [caseModalOpen, setCaseModalOpen] = useState(false)
  const [casesLoading, setCasesLoading] = useState(false)
  const [casesError, setCasesError] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [historySessions, setHistorySessions] = useState([])
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState(null)
  const [historyItems, setHistoryItems] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [timelineIndex, setTimelineIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [voices, setVoices] = useState([])
  const recognitionRef = useRef(null)
  const currentAudioRef = useRef(null)
  const remoteSpeakTokenRef = useRef(0)
  const translationCacheRef = useRef(new Map())
  const reportRef = useRef(null)

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

      let activeSessionId = sessionId
      if (!activeSessionId) {
        const created = await createSession('Investigation Session')
        activeSessionId = created.session_id
        setSessionId(activeSessionId)
      }

      await addHistoryItem({
        session_id: activeSessionId,
        query_text: message,
        summary_text: summarizeExplanation(englishExplanation),
        report_json: {
          result: response.result || null,
          explanation: englishExplanation,
          rawEnglishExplanation: englishExplanation,
          selectedLanguage,
        },
      })
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

  const fetchSavedCases = async () => {
    setCasesLoading(true)
    setCasesError('')
    try {
      const data = await listCases()
      setSavedCases(Array.isArray(data) ? data : [])
    } catch (error) {
      setCasesError(error.message || 'Failed to load saved cases')
    } finally {
      setCasesLoading(false)
    }
  }

  const handleOpenCaseModal = async () => {
    setCaseModalOpen(true)
    await fetchSavedCases()
  }

  const fetchHistorySessions = async () => {
    setHistoryLoading(true)
    setHistoryError('')
    try {
      const sessions = await listSessions()
      setHistorySessions(Array.isArray(sessions) ? sessions : [])
      if (Array.isArray(sessions) && sessions.length > 0 && selectedHistorySessionId == null) {
        setSelectedHistorySessionId(sessions[0].id)
      }
    } catch (error) {
      setHistoryError(error.message || 'Failed to load sessions')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleOpenHistoryModal = async () => {
    setHistoryModalOpen(true)
    await fetchHistorySessions()
  }

  const handleSelectHistorySession = async (historySessionId) => {
    setSelectedHistorySessionId(historySessionId)
    setHistoryLoading(true)
    setHistoryError('')
    try {
      const items = await getSessionHistory(historySessionId)
      setHistoryItems(Array.isArray(items) ? items : [])
    } catch (error) {
      setHistoryItems([])
      setHistoryError(error.message || 'Failed to load session history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleClearAllSessions = async () => {
    if (!window.confirm('Are you sure you want to delete all sessions and history? This cannot be undone.')) {
      return
    }

    setHistoryLoading(true)
    setHistoryError('')
    try {
      await clearAllSessions()
      setHistorySessions([])
      setSelectedHistorySessionId(null)
      setHistoryItems([])
      setCaseMessage('All sessions cleared successfully')
      setCaseMessageType('success')
    } catch (error) {
      setHistoryError(error.message || 'Failed to clear sessions')
      setCaseMessage(error.message || 'Failed to clear sessions')
      setCaseMessageType('error')
    } finally {
      setHistoryLoading(false)
    }
  }

  const resetAiAnalysisState = () => {
    setChatHistory([])
    setChatInput('')
    setChatError('')
    setChatResponse(null)
    setRawEnglishExplanation('')
    setLocalizedSections({
      keyObservations: [],
      details: [],
      nextSteps: [],
    })
    setTimelineIndex(0)
  }

  const handleLoadHistoryCard = (item) => {
    const report = item?.report_json || {}

    // Clear previous AI analysis data before applying a history report.
    resetAiAnalysisState()

    setChatResponse({
      result: report.result || null,
      explanation: report.explanation || '',
    })
    setRawEnglishExplanation(report.rawEnglishExplanation || report.explanation || '')
    if (report.selectedLanguage) {
      setSelectedLanguage(report.selectedLanguage)
    }
    setHistoryModalOpen(false)
    setCaseMessage('Loaded report from history card')
    setCaseMessageType('success')
  }

  const handleSaveCase = async () => {
    if (!chatResponse) {
      setCaseMessage('No case result to save yet.')
      setCaseMessageType('error')
      return
    }

    const defaultName = `Case ${new Date().toLocaleString()}`
    const userInput = window.prompt('Enter case name', defaultName)
    const caseName = (userInput || '').trim()
    if (!caseName) {
      return
    }

    try {
      const payload = {
        name: caseName,
        data_json: {
          resultPayload: chatResponse.result || null,
          graphData,
          tableData,
        },
        report_json: {
          explanation: chatResponse.explanation || '',
          rawEnglishExplanation,
          localizedSections,
          selectedLanguage,
        },
      }
      await saveCase(payload)
      setCaseMessage(`Saved case: ${caseName}`)
      setCaseMessageType('success')
    } catch (error) {
      setCaseMessage(error.message || 'Failed to save case')
      setCaseMessageType('error')
    }
  }

  const handleLoadCase = async (caseId) => {
    try {
      const loadedCase = await loadCase(caseId)
      const dataJson = loadedCase?.data_json || {}
      const reportJson = loadedCase?.report_json || {}

      const restoredResponse = {
        result: dataJson.resultPayload || null,
        explanation: reportJson.explanation || '',
      }

      setChatResponse(restoredResponse)
      setRawEnglishExplanation(reportJson.rawEnglishExplanation || reportJson.explanation || '')
      setLocalizedSections(
        reportJson.localizedSections || {
          keyObservations: [],
          details: [],
          nextSteps: [],
        }
      )
      setSelectedLanguage(reportJson.selectedLanguage || 'English')
      setCaseMessage(`Loaded case: ${loadedCase.name}`)
      setCaseMessageType('success')
      setCaseModalOpen(false)
    } catch (error) {
      setCaseMessage(error.message || 'Failed to load case')
      setCaseMessageType('error')
    }
  }

  const handleExportPdf = async () => {
    if (!reportRef.current) {
      return
    }

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0b1f3a',
        ignoreElements: (el) =>
          el.classList?.contains('leaflet-container') || el.classList?.contains('forensics-map'),
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
      const imgWidth = canvas.width * ratio
      const imgHeight = canvas.height * ratio

      pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 8, imgWidth, imgHeight)
      pdf.save(`case-report-${Date.now()}.pdf`)
    } catch (error) {
      setCaseMessage(error.message || 'Failed to export PDF')
      setCaseMessageType('error')
    }
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
    let playedAnyChunk = false

    const playChunk = async (chunk, clientType) => {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=${clientType}&tl=${selectedLangCode}&q=${encodeURIComponent(chunk)}`
      const audio = new Audio(ttsUrl)
      currentAudioRef.current = audio

      return new Promise((resolve) => {
        audio.onended = () => resolve(true)
        audio.onerror = () => resolve(false)
        audio.play().catch(() => resolve(false))
      })
    }

    for (const chunk of textChunks) {
      if (token !== remoteSpeakTokenRef.current) {
        return playedAnyChunk
      }

      let played = await playChunk(chunk, 'tw-ob')
      if (!played) {
        // Some regions/user agents reject tw-ob; gtx is a useful fallback.
        played = await playChunk(chunk, 'gtx')
      }

      playedAnyChunk = playedAnyChunk || played
    }

    if (token === remoteSpeakTokenRef.current) {
      currentAudioRef.current = null
    }

    return playedAnyChunk
  }

  const speakText = async (text) => {
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

    if (selectedLanguage !== 'English') {
      const remoteWorked = await playRemoteTTS(chunks, targetLangCode)
      if (remoteWorked) {
        return
      }
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

  const getSpeechTextForSelectedLanguage = async () => {
    if (selectedLanguage === 'English') {
      return reportSpeechText
    }

    if (hasStructuredSections && reportSpeechText) {
      return reportSpeechText
    }

    const englishFallback = cleanMarkdownForChat(rawEnglishExplanation || reportSpeechText)
    if (!englishFallback) {
      return ''
    }

    const translated = await translateFromEnglishCached(englishFallback, selectedLanguage)
    return translated || englishFallback
  }

  const handleSpeakLastResponse = async () => {
    const text = await getSpeechTextForSelectedLanguage()
    void speakText(text)
  }

  const handleStopSpeaking = () => {
    stopRemoteAudio()
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  const resultPayload = chatResponse?.result || null

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

  const timelinePoints = useMemo(() => {
    const buckets = tableData
      .map((row) => ({
        time: extractTimeField(row),
        tower: row.tower_id || row.tower || '-',
        location: row.location || '-',
        epoch: toEpoch(extractTimeField(row)),
      }))
      .filter((item) => item.time && item.epoch !== null)
      .sort((a, b) => a.epoch - b.epoch)

    return Array.from(new Map(buckets.map((item) => [item.epoch, item])).values())
  }, [tableData])

  useEffect(() => {
    if (timelinePoints.length > 0) {
      setTimelineIndex(timelinePoints.length - 1)
    } else {
      setTimelineIndex(0)
    }
  }, [timelinePoints])

  useEffect(() => {
    if (historyModalOpen && selectedHistorySessionId != null) {
      handleSelectHistorySession(selectedHistorySessionId)
    }
  }, [historyModalOpen, selectedHistorySessionId])

  const filteredTableData = useMemo(() => {
    if (!tableData.length || !timelinePoints.length) {
      return tableData
    }

    const activePoint = timelinePoints[Math.min(timelineIndex, timelinePoints.length - 1)]
    const activeEpoch = activePoint?.epoch ?? null
    if (activeEpoch === null) {
      return tableData
    }

    return tableData.filter((row) => {
      const rowEpoch = toEpoch(extractTimeField(row))
      if (rowEpoch === null) {
        return true
      }
      return rowEpoch <= activeEpoch
    })
  }, [tableData, timelinePoints, timelineIndex])

  const mapRows = useMemo(() => {
    if (filteredTableData.length) {
      return filteredTableData
    }
    return tableData
  }, [filteredTableData, tableData])

  const suspectNumbers = useMemo(() => {
    if (!Array.isArray(resultPayload?.suspects)) {
      return []
    }
    return resultPayload.suspects.map((item) => String(item))
  }, [resultPayload])

  const timelineData = timelinePoints.map((item) => ({
    time: item.time,
    tower: item.tower,
    location: item.location,
  }))

  const graphData = useMemo(() => {
    if (!resultPayload) {
      return null
    }

    if (Array.isArray(resultPayload.nodes) && Array.isArray(resultPayload.edges)) {
      return { nodes: resultPayload.nodes, edges: resultPayload.edges }
    }

    if (Array.isArray(mapRows) && mapRows.length > 1) {
      const nodes = []
      const seen = new Set()
      const edges = []

      mapRows.forEach((row, index) => {
        const tower = String(row.tower_id || row.tower || '')
        if (!tower) {
          return
        }
        if (!seen.has(tower)) {
          seen.add(tower)
          nodes.push({ id: tower })
        }
        if (index > 0) {
          const previous = String(mapRows[index - 1].tower_id || mapRows[index - 1].tower || '')
          if (previous && previous !== tower) {
            edges.push({ source: previous, target: tower, weight: 1 })
          }
        }
      })

      if (nodes.length && edges.length) {
        return { nodes, edges }
      }
    }

    return null
  }, [resultPayload, mapRows])

  const crimeTowerId = resultPayload?.crime?.tower || null
  const suspectTowers = resultPayload?.suspect_towers || []

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
        <div className="topbar-actions">
          <button type="button" className="btn-secondary" onClick={handleOpenCaseModal}>
            Load Case
          </button>
        </div>
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
          <div ref={reportRef}>
            {caseMessage && (
              <div className={caseMessageType === 'success' ? 'success' : 'error'} style={{ marginBottom: '16px' }}>{caseMessage}</div>
            )}
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
                <button type="button" className="btn-secondary" onClick={handleSaveCase}>
                  Save Case
                </button>
                <button type="button" className="btn-secondary" onClick={handleOpenCaseModal}>
                  Load Case
                </button>
                <button type="button" className="btn-secondary" onClick={handleOpenHistoryModal}>
                  History
                </button>
                <button type="button" className="btn-secondary" onClick={handleExportPdf}>
                  Export PDF
                </button>
                <button
                  type="button"
                  className="btn-secondary speak-btn"
                  onClick={() => void handleSpeakLastResponse()}
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

              <RiskAlert
                riskLevel={resultPayload?.risk_level || 'LOW'}
                reasons={resultPayload?.risk_reason || []}
              />

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

              <TimelineSlider
                timeline={timelineData}
                activeIndex={timelineIndex}
                onChange={setTimelineIndex}
              />

              <MapView
                towerData={{ towers: mapRows }}
                crimeTowerId={crimeTowerId}
                suspectTowers={suspectTowers}
              />

              {graphData && (
                <ForceGraphView
                  nodes={graphData.nodes}
                  edges={graphData.edges}
                  mainNumber={resultPayload?.number || ''}
                  suspectNumbers={suspectNumbers}
                />
              )}

              {Array.isArray(filteredTableData) && filteredTableData.length > 0 && (
                <DynamicTable
                  title={Array.isArray(resultPayload?.movement) ? 'Movement Timeline' : 'Data Table'}
                  data={filteredTableData}
                  suspectNumbers={suspectNumbers}
                />
              )}
            </ReportCard>
          </div>
        )}
      </section>

      <CaseListModal
        isOpen={caseModalOpen}
        onClose={() => setCaseModalOpen(false)}
        cases={savedCases}
        loading={casesLoading}
        error={casesError}
        onLoadCase={handleLoadCase}
        onRefresh={fetchSavedCases}
      />

      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        sessions={historySessions}
        selectedSessionId={selectedHistorySessionId}
        historyItems={historyItems}
        loading={historyLoading}
        error={historyError}
        onRefreshSessions={fetchHistorySessions}
        onSelectSession={handleSelectHistorySession}
        onLoadHistoryCard={handleLoadHistoryCard}
        onClearAllSessions={handleClearAllSessions}
      />
    </div>
  )
}

export default Analysis
