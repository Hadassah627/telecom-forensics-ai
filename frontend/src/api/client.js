import { API_BASE_URL } from './config'

export async function checkApi() {
  const response = await fetch(`${API_BASE_URL}/test`)
  return response.ok
}

export async function uploadDataset(file, datasetType) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('dataset_type', datasetType.toLowerCase())

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Upload failed (${response.status})`)
  }
  return data
}

export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Chat request failed (${response.status})`)
  }
  return data
}

export async function saveCase(payload) {
  const response = await fetch(`${API_BASE_URL}/case/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Case save failed (${response.status})`)
  }
  return data
}

export async function listCases() {
  const response = await fetch(`${API_BASE_URL}/case/list`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Case list failed (${response.status})`)
  }
  return data
}

export async function loadCase(caseId) {
  const response = await fetch(`${API_BASE_URL}/case/load/${caseId}`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Case load failed (${response.status})`)
  }
  return data
}

export async function createSession(name) {
  const response = await fetch(`${API_BASE_URL}/session/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Session create failed (${response.status})`)
  }
  return data
}

export async function listSessions() {
  const response = await fetch(`${API_BASE_URL}/session/list`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Session list failed (${response.status})`)
  }
  return data
}

export async function addHistoryItem(payload) {
  const response = await fetch(`${API_BASE_URL}/history/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `History add failed (${response.status})`)
  }
  return data
}

export async function getSessionHistory(sessionId) {
  const response = await fetch(`${API_BASE_URL}/history/${sessionId}`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `History list failed (${response.status})`)
  }
  return data
}

export async function clearAllSessions() {
  const response = await fetch(`${API_BASE_URL}/session/clear-all`, {
    method: 'DELETE',
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `Clear sessions failed (${response.status})`)
  }
  return data
}
