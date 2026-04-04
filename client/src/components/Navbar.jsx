"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { useTheme } from "../context/themeContext"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, LogOut, BarChart2 } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: "Your data analysis completed successfully.", time: "2m ago", unread: true },
    { id: 2, text: "System maintenance scheduled for tonight.", time: "1h ago", unread: false },
    { id: 3, text: "A new feature 'AI Insights' is now live!", time: "2d ago", unread: false }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link 
          to="/" 
          className="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <BarChart2 size={24} color="var(--accent-blue)" />
          <span className="gradient-text" style={{ fontWeight: 700 }}>ExcelAnalytics</span>
        </Link>

        <div className="nav-menu">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {/* Notification Bell */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "8px", position: "relative", display: "flex", borderRadius: "8px", transition: "color 0.2s" }}
                >
                  <Bell size={20} />
                  {notifications.some(n => n.unread) && (
                    <span style={{ position: "absolute", top: "6px", right: "6px", width: "8px", height: "8px", background: "var(--error-color)", borderRadius: "50%", boxShadow: "0 0 6px rgba(255,92,92,0.5)" }} />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="glass-panel-strong"
                      style={{ position: "absolute", top: "45px", right: "-10px", width: "320px", maxWidth: "90vw", overflow: "hidden", zIndex: 200 }}
                    >
                      <div style={{ padding: "16px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ margin: 0, color: "var(--text-primary)", fontWeight: 600 }}>Notifications</h4>
                        <span style={{ fontSize: "0.8rem", color: "var(--accent-blue)", cursor: "pointer" }}>Mark all read</span>
                      </div>
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {notifications.map(note => (
                          <div key={note.id} style={{ padding: "14px 16px", borderBottom: "1px solid var(--glass-border)", display: "flex", gap: "12px", background: note.unread ? "rgba(76,132,255,0.04)" : "transparent", transition: "background 0.2s" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: note.unread ? "var(--accent-blue)" : "transparent", marginTop: "6px", flexShrink: 0, boxShadow: note.unread ? "0 0 8px rgba(76,132,255,0.4)" : "none" }} />
                            <div>
                              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: "1.4" }}>{note.text}</p>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{note.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={logout} className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/signin" className="nav-link" style={{ fontWeight: 500 }}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: "8px 20px" }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
