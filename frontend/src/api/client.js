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
