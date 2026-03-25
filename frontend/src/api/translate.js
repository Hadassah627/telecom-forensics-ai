const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get'
const GOOGLE_TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single'
const MAX_QUERY_CHARS = 450
const TRANSLATION_CACHE = new Map()

export const LANGUAGE_CODES = {
  English: 'en',
  Hindi: 'hi',
  Telugu: 'te',
  Tamil: 'ta',
  Kannada: 'kn',
}

function splitIntoChunks(text, maxChars = MAX_QUERY_CHARS) {
  const input = text || ''
  if (input.length <= maxChars) {
    return [input]
  }

  const chunks = []
  const blocks = input.split(/(\n\n+)/)
  let buffer = ''

  const pushBuffer = () => {
    if (buffer) {
      chunks.push(buffer)
      buffer = ''
    }
  }

  for (const block of blocks) {
    if (block.length > maxChars) {
      pushBuffer()

      const parts = block.split(/(?<=[.!?])\s+/)
      let sentenceBuffer = ''

      for (const part of parts) {
        if (!part) {
          continue
        }

        if (part.length > maxChars) {
          if (sentenceBuffer) {
            chunks.push(sentenceBuffer)
            sentenceBuffer = ''
          }
          for (let i = 0; i < part.length; i += maxChars) {
            chunks.push(part.slice(i, i + maxChars))
          }
          continue
        }

        const candidate = sentenceBuffer ? `${sentenceBuffer} ${part}` : part
        if (candidate.length <= maxChars) {
          sentenceBuffer = candidate
        } else {
          chunks.push(sentenceBuffer)
          sentenceBuffer = part
        }
      }

      if (sentenceBuffer) {
        chunks.push(sentenceBuffer)
      }
      continue
    }

    const candidate = buffer ? `${buffer}${block}` : block
    if (candidate.length <= maxChars) {
      buffer = candidate
    } else {
      pushBuffer()
      buffer = block
    }
  }

  pushBuffer()
  return chunks.length ? chunks : [input]
}

function hasProviderLimitError(translatedText = '') {
  const normalized = translatedText.toLowerCase()
  return (
    normalized.includes('query length limit exceeded') ||
    normalized.includes('max allowed query')
  )
}

function normalizeForCompare(text = '') {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
}

function hasLikelyTranslation(original = '', translated = '') {
  if (!translated) {
    return false
  }
  return normalizeForCompare(original) !== normalizeForCompare(translated)
}

async function translateChunkMyMemory(text, sourceLang, targetLang) {
  const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
  const response = await fetch(url)
  if (!response.ok) {
    return ''
  }

  const data = await response.json()
  const translated = data?.responseData?.translatedText || ''
  if (!translated || hasProviderLimitError(translated)) {
    return ''
  }

  return translated
}

async function translateChunkGoogle(text, sourceLang, targetLang) {
  const url = `${GOOGLE_TRANSLATE_ENDPOINT}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
  const response = await fetch(url)
  if (!response.ok) {
    return ''
  }

  const data = await response.json()
  const parts = Array.isArray(data?.[0]) ? data[0] : []
  const translated = parts
    .map((part) => (Array.isArray(part) ? part[0] : ''))
    .join('')
    .trim()

  return translated
}

async function translateChunk(chunk, sourceLang, targetLang) {
  const text = (chunk || '').trim()
  if (!text) {
    return chunk || ''
  }

  const cacheKey = `${sourceLang}|${targetLang}|${text}`
  if (TRANSLATION_CACHE.has(cacheKey)) {
    return TRANSLATION_CACHE.get(cacheKey)
  }

  let translated = ''
  try {
    translated = await translateChunkMyMemory(text, sourceLang, targetLang)
    if (!hasLikelyTranslation(text, translated)) {
      translated = await translateChunkGoogle(text, sourceLang, targetLang)
    }
  } catch {
    translated = ''
  }

  const finalText = hasLikelyTranslation(text, translated) ? translated : chunk
  TRANSLATION_CACHE.set(cacheKey, finalText)
  return finalText
}

async function translateText(text, sourceLang, targetLang) {
  const cleanText = (text || '').trim()
  if (!cleanText || sourceLang === targetLang) {
    return cleanText
  }

  const cacheKey = `${sourceLang}|${targetLang}|FULL|${cleanText}`
  if (TRANSLATION_CACHE.has(cacheKey)) {
    return TRANSLATION_CACHE.get(cacheKey)
  }

  const chunks = splitIntoChunks(cleanText)
  const translatedChunks = []
  for (const chunk of chunks) {
    // Sequential translation avoids burst limits on free translation APIs.
    const translatedChunk = await translateChunk(chunk, sourceLang, targetLang)
    translatedChunks.push(translatedChunk)
  }

  const combined = translatedChunks.join('')
  TRANSLATION_CACHE.set(cacheKey, combined)
  return combined
}

export async function translateToEnglish(text, selectedLanguage = 'English') {
  const sourceLang = LANGUAGE_CODES[selectedLanguage] || 'en'
  return translateText(text, sourceLang, 'en')
}

export async function translateFromEnglish(text, selectedLanguage = 'English') {
  const targetLang = LANGUAGE_CODES[selectedLanguage] || 'en'
  return translateText(text, 'en', targetLang)
}
