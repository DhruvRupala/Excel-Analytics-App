"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import { useAuth } from "../context/authContext"

const AIAnalytics = () => {
  const { token } = useAuth()
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [query, setQuery] = useState("")
  const [aiResponse, setAiResponse] = useState(null)
  const [loadingFiles, setLoadingFiles] = useState(true)
  const [loadingAI, setLoadingAI] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
      setMessage("Failed to load files for AI analysis.")
    } finally {
      setLoadingFiles(false)
    }
  }

  const handleQuerySubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setMessage("Please select an Excel file first.")
      return
    }
    if (!query.trim()) {
      setMessage("Please enter a query.")
      return
    }

    setLoadingAI(true)
    setMessage("")
    setAiResponse(null)

    try {
      const response = await fetch("http://localhost:5000/api/ai/query", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: selectedFile._id, query }),
      })

      const data = await response.json()

      if (response.ok) {
        setAiResponse(data)
        setMessage("AI analysis completed.")
      } else {
        setMessage(data.message || "AI query failed.")
        setAiResponse(null)
      }
    } catch (error) {
      console.error("AI query error:", error)
      setMessage("Network error during AI query. Please check server connection.")
    } finally {
      setLoadingAI(false)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <div className="ai-analytics-container">
          <div className="ai-analytics-header">
            <h1>AI Data Analysis</h1>
            <p>Ask questions about your Excel data using natural language.</p>
          </div>

          {message && (
            <div
              className={`message ${message.includes("success") || message.includes("completed") ? "success" : "error"}`}
            >
              {message}
            </div>
          )}

          {loadingFiles ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading files...</p>
            </div>
          ) : (
            <div className="ai-analytics-content">
              <div className="control-group">
                <label>Select File for AI Analysis:</label>
                <select
                  value={selectedFile?._id || ""}
                  onChange={(e) => {
                    const file = files.find((f) => f._id === e.target.value)
                    setSelectedFile(file)
                    setAiResponse(null) // Clear previous results
                    setMessage("")
                  }}
                  className="control-select"
                >
                  <option value="">Choose a file...</option>
                  {files.map((file) => (
                    <option key={file._id} value={file._id}>
                      {file.filename}
                    </option>
                  ))}
                </select>
              </div>

              {files.length === 0 && !loadingFiles && (
                <div className="empty-state">
                  <div className="empty-icon">📁</div>
                  <h3>No files uploaded</h3>
                  <p>
                    <a href="/upload">Upload your first Excel file</a> to use AI analysis
                  </p>
                </div>
              )}

              {selectedFile && (
                <div className="ai-query-card">
                  <h3>Ask a Question about "{selectedFile.filename}"</h3>
                  <form onSubmit={handleQuerySubmit} className="ai-query-form">
                    <textarea
                      className="ai-query-input"
                      placeholder="e.g., 'What is the average salary by department?', 'Show me the top 5 sales people by revenue', 'Summarize this data'"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows="3"
                      disabled={loadingAI}
                    ></textarea>
                    <button type="submit" className="btn btn-primary" disabled={loadingAI}>
                      {loadingAI ? "Analyzing..." : "Get AI Insight"}
                    </button>
                  </form>

                  {loadingAI && (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>AI is processing your query...</p>
                    </div>
                  )}

                  {aiResponse && (
                    <div className="ai-results-card">
                      <h4>AI Response:</h4>
                      {aiResponse.naturalLanguageExplanation && (
                        <p className="ai-explanation">{aiResponse.naturalLanguageExplanation}</p>
                      )}

                      {aiResponse.resultData && aiResponse.resultData.rows && aiResponse.resultData.rows.length > 0 ? (
                        <div className="data-table-container">
                          <table className="data-table">
                            <thead>
                              <tr>
                                {aiResponse.resultData.headers?.map((header, index) => (
                                  <th key={index}>{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {aiResponse.resultData.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {aiResponse.resultData.headers.map((header, colIndex) => (
                                    <td key={colIndex}>{row[header] !== undefined ? String(row[header]) : "N/A"}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {aiResponse.resultData.rows.length > 10 && (
                            <div className="table-footer">
                              <p>
                                Showing first {Math.min(aiResponse.resultData.rows.length, 10)} rows of{" "}
                                {aiResponse.resultData.rows.length} total results
                              </p>
                            </div>
                          )}
                        </div>
                      ) : aiResponse.resultData && aiResponse.resultData.error ? (
                        <p className="error-message">Error processing data: {aiResponse.resultData.error}</p>
                      ) : (
                        <p>No structured data results to display for this query.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AIAnalytics
