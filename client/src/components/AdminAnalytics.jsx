"use client"
import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import { useAuth } from "../context/authContext"
import { motion } from "framer-motion"
import { Users, Activity, BarChart2, ShieldAlert } from "lucide-react"

const AdminAnalytics = () => {
  const { token, user } = useAuth()
  const [stats, setStats] = useState({ totalUsers: 0, totalLogs: 0, recentLogs: [] })
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAdminStats() }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch((process.env.NODE_ENV === "production" ? "https://excel-analytics-app-19wy.onrender.com" : "http://localhost:5000") + "/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      if (response.ok) setStats(await response.json())
    } catch (error) { console.error("Error fetching admin stats:", error) }
    finally { setLoading(false) }
  }

  if (user?.role !== "admin") {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="admin-denied">
            <ShieldAlert size={64} color="var(--error-color)" />
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
          </div>
        </main>
      </div>
    )
  }

  const adminCards = [
    { icon: <Users size={28} />, value: stats.totalUsers, label: "Total Users", color: "#4c84ff" },
    { icon: <Activity size={28} />, value: stats.totalLogs, label: "Platform Actions", color: "#8a2be2" },
  ]

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main" style={{ padding: "36px" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>Admin Analytics</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>System-wide statistics and activity monitoring</p>
        </motion.div>

        {loading ? (
          <div className="loading-container" style={{ height: "300px", flexDirection: "row" }}>
            <div className="loading-spinner" /><p style={{ color: "var(--text-secondary)", marginLeft: "16px" }}>Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              {adminCards.map((card, i) => (
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

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="recent-files">
              <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}><BarChart2 size={22} color="var(--accent-blue)" /> Recent System Activity</h2>
              {stats.recentLogs.length > 0 ? (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead><tr><th>User</th><th>Action</th><th>Details</th><th>Time</th></tr></thead>
                    <tbody>
                      {stats.recentLogs.map((log) => (
                        <tr key={log._id}>
                          <td>{log.user?.name || "Unknown"}</td>
                          <td><span style={{ padding: "4px 10px", background: "rgba(76,132,255,0.08)", color: "var(--accent-blue)", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 500 }}>{log.action}</span></td>
                          <td style={{ color: "var(--text-secondary)" }}>{log.details}</td>
                          <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: "40px" }}><p>No recent activity to display.</p></div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminAnalytics
