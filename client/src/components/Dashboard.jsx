"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import { useAuth } from "../context/authContext"
import { motion } from "framer-motion"
import { FileSpreadsheet, Layers, Zap, FileText } from "lucide-react"

const Dashboard = () => {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({ totalFiles: 0, totalRows: 0, recentUploads: [] })
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchDashboardStats() }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch((process.env.NODE_ENV === "production" ? "https://excel-analytics-app-19wy.onrender.com" : "http://localhost:5000") + "/api/files/stats", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (response.ok) setStats(await response.json())
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: <FileSpreadsheet size={28} />, value: stats.totalFiles, label: "Total Files", color: "#4c84ff" },
    { icon: <Layers size={28} />, value: stats.totalRows, label: "Rows Processed", color: "#8a2be2" },
    { icon: <Zap size={28} />, value: stats.recentUploads.length, label: "Recent Uploads", color: "#00e5a0" },
  ]

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>Welcome back, {user?.name}!</p>
        </motion.div>

        {loading ? (
          <div className="loading-container" style={{ height: "300px", flexDirection: "row" }}>
            <div className="loading-spinner" />
            <p style={{ color: "var(--text-secondary)", marginLeft: "16px" }}>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="stats-grid">
              {statCards.map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
                  <div style={{ background: `${card.color}14`, borderRadius: "14px", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                    {card.icon}
                  </div>
                  <div className="stat-info">
                    <h3>{card.value}</h3>
                    <p>{card.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent files */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="recent-files">
              <h2>Recent Uploads</h2>
              {stats.recentUploads.length > 0 ? (
                <div className="files-list">
                  {stats.recentUploads.map((file) => (
                    <motion.div key={file._id} whileHover={{ borderColor: "rgba(76,132,255,0.2)" }} className="file-item">
                      <div className="file-info-wrapper">
                        <div style={{ background: "rgba(76,132,255,0.08)", borderRadius: "10px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FileText size={22} color="var(--accent-blue)" />
                        </div>
                        <div className="file-info">
                          <h4>{file.filename}</h4>
                          <div style={{ display: "flex", gap: "16px" }}>
                            <p>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
                            <p>Rows: {file.rowCount || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: "40px" }}>
                  <p>No files uploaded yet. <a href="/upload">Upload your first file</a></p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
