import React from 'react'

export default function UploadPage({
  file,
  datasetType,
  uploadLoading,
  uploadMessage,
  uploadMessageType,
  handleFileChange,
  handleDatasetTypeChange,
  handleStartAnalysis,
  onOpenChat,
}) {
  return (
    <article className="analysis-card">
      <h2 style={{ margin: 0 }}>Upload Dataset</h2>
      {uploadMessage && (
        <div className={uploadMessageType === 'success' ? 'success' : 'error'}>
          {uploadMessage}
        </div>
      )}

      <form onSubmit={handleStartAnalysis}>
        <div className="form-group">
          <label htmlFor="datasetType">Dataset Type</label>
          <select id="datasetType" value={datasetType} onChange={handleDatasetTypeChange} disabled={uploadLoading}>
            <option value="CDR">CDR (Call Detail Records)</option>
            <option value="Tower">Tower Data</option>
            <option value="IPDR">IPDR (IP Detail Records)</option>
            <option value="Crime">Crime Scene Data</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fileInput" className="file-input-label">
            <p>Click to upload forensic dataset</p>
            <p className="muted-text">{file ? `Selected: ${file.name}` : 'Excel files (.xlsx, .xls) supported'}</p>
            <input type="file" id="fileInput" onChange={handleFileChange} disabled={uploadLoading} accept=".xlsx,.xls" />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <button type="submit" className="btn-primary" disabled={uploadLoading || !file}>
            {uploadLoading ? 'Uploading...' : 'Upload Dataset'}
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => onOpenChat && onOpenChat()}
            aria-label="Open AI Chat"
          >
            AI Chat
          </button>
        </div>
      </form>
    </article>
  )
}
