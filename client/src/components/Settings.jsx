"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useAuth } from "../context/authContext"
import { useTheme } from "../context/themeContext"
import { motion } from "framer-motion"

const Settings = () => {
  const { user, token, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value })

  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage("")
    if (passwordData.newPassword !== passwordData.confirmPassword) { setMessage("New passwords do not match"); setLoading(false); return }
    try {
      const response = await fetch((process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000") + "/api/users/change-password", {
        method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      })
      const data = await response.json()
      if (response.ok) { setMessage("Password changed successfully!"); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }) }
      else setMessage(data.message || "Password change failed")
    } catch (error) { setMessage("Network error occurred") }
    finally { setLoading(false) }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return
    setDeleteLoading(true); setMessage("")
    try {
      const response = await fetch((process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000") + "/api/users/delete-account", {
        method: "DELETE", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (response.ok) { setMessage("Account deleted successfully. Redirecting..."); logout(); localStorage.clear(); setTimeout(() => navigate("/signin"), 2000) }
      else setMessage(data.message || "Failed to delete account.")
    } catch (error) { setMessage("Network error occurred during account deletion.") }
    finally { setDeleteLoading(false) }
  }

  const handleClearLocalCache = () => {
    if (window.confirm("Clear local cache? This will log you out.")) { localStorage.clear(); logout(); navigate("/signin") }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <div className="settings-container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="settings-header">
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </motion.div>

          {message && <div className={`message ${message.includes("success") || message.includes("deleted") ? "success" : "error"}`}>{message}</div>}

          <div className="settings-content">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="settings-section">
              <h2>General</h2>
              <div className="settings-group">
                <label htmlFor="theme-toggle">Theme</label>
                <div className="flex items-center gap-2">
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Light</span>
                  <label className="switch">
                    <input type="checkbox" id="theme-toggle" checked={theme === "modern-dark"} onChange={toggleTheme} />
                    <span className="slider round"></span>
                  </label>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Cosmic</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="settings-section">
              <h2>Security</h2>
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group"><label htmlFor="currentPassword">Current Password</label><input type="password" id="currentPassword" name="currentPassword" className="glass-input" value={passwordData.currentPassword} onChange={handlePasswordChange} required placeholder="Enter current password" /></div>
                <div className="form-group"><label htmlFor="newPassword">New Password</label><input type="password" id="newPassword" name="newPassword" className="glass-input" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="Enter new password" /></div>
                <div className="form-group"><label htmlFor="confirmPassword">Confirm New Password</label><input type="password" id="confirmPassword" name="confirmPassword" className="glass-input" value={passwordData.confirmPassword} onChange={handlePasswordChange} required placeholder="Confirm new password" /></div>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Changing..." : "Change Password"}</button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="settings-section">
              <h2>Account Management</h2>
              <div className="account-info">
                <div className="info-item"><span className="info-label">Name:</span><span className="info-value">{user?.name}</span></div>
                <div className="info-item"><span className="info-label">Email:</span><span className="info-value">{user?.email}</span></div>
                <div className="info-item"><span className="info-label">Member since:</span><span className="info-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span></div>
              </div>
              <div className="management-actions" style={{ marginTop: "20px" }}>
                <button onClick={handleDeleteAccount} className="btn btn-danger" disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete Account"}</button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="settings-section">
              <h2>Data & Cache</h2>
              <div className="data-management">
                <p>Manage your uploaded files and local application data.</p>
                <div className="management-actions">
                  <button className="btn btn-secondary">Export Data</button>
                  <button className="btn btn-secondary" onClick={handleClearLocalCache}>Clear Cache</button>
                  <button className="btn btn-danger">Delete All Files</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
