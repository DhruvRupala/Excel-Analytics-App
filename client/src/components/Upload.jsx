"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import { useAuth } from "../context/authContext"
import { motion } from "framer-motion"
import { Upload as UploadIcon, FileText, CheckCircle } from "lucide-react"

const Upload = () => {
  const { token } = useAuth()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls")) {
        setFile(selectedFile)
        setMessage("")
      } else {
        setMessage("Please select a valid Excel file (.xlsx or .xls)")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) { setMessage("Please select a file first"); return }
    setUploading(true); setMessage(""); setUploadProgress(0)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
      })
      xhr.onload = () => {
        if (xhr.status === 200) {
          setMessage("File uploaded and processed successfully!")
          setFile(null); setUploadProgress(0)
          document.getElementById("file-input").value = ""
        } else {
          const error = JSON.parse(xhr.responseText)
          setMessage(error.message || "Upload failed")
        }
        setUploading(false)
      }
      xhr.onerror = () => { setMessage("Upload failed. Please try again."); setUploading(false); setUploadProgress(0) }
      xhr.open("POST", (process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000") + "/api/files/upload")
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.send(formData)
    } catch (error) {
      console.error("Upload error:", error)
      setMessage("Upload failed. Please try again.")
      setUploading(false); setUploadProgress(0)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <div className="upload-container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="upload-header">
            <h1>Upload Excel File</h1>
            <p>Upload your Excel files (.xlsx or .xls) for analysis</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="upload-card">
            <div className="upload-area">
              <div style={{ color: "var(--accent-blue)", marginBottom: "16px" }}>
                <UploadIcon size={48} strokeWidth={1.5} />
              </div>
              <h3>Select Excel File</h3>
              <p>Choose an Excel file to upload and analyze</p>
              <input id="file-input" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="file-input" />

              {file && (
                <div className="file-selected">
                  <div className="file-info" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <FileText size={20} color="var(--accent-blue)" />
                    <div>
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${uploadProgress}%` }} /></div>
                  <p style={{ color: "var(--text-secondary)" }}>{uploadProgress}% uploaded</p>
                </div>
              )}

              <button onClick={handleUpload} disabled={!file || uploading} className="btn btn-primary upload-btn">
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>

            {message && <div className={`message ${message.includes("success") ? "success" : "error"}`} style={{ marginTop: "20px" }}>{message}</div>}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="upload-info">
            <h3><CheckCircle size={16} style={{ marginRight: "8px", color: "var(--success-color)" }} />Supported File Types</h3>
            <ul><li>Excel 2007+ (.xlsx)</li><li>Excel 97-2003 (.xls)</li></ul>
            <h3 style={{ marginTop: "20px" }}><CheckCircle size={16} style={{ marginRight: "8px", color: "var(--success-color)" }} />File Requirements</h3>
            <ul><li>Maximum file size: 10MB</li><li>Files should contain structured data</li><li>First row should contain column headers</li></ul>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Upload
