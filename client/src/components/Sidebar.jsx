import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { Home, Upload, ClipboardList, BarChart, LineChart, Brain, Settings, User, LogOut, ChevronLeft, ChevronRight, BarChart2, ShieldAlert, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => { if (isMobile) setMobileOpen(false) }, [location.pathname, isMobile])

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/upload", icon: Upload, label: "Upload File" },
    { path: "/view-data", icon: ClipboardList, label: "View Data" },
    { path: "/analytics", icon: BarChart, label: "Analytics" },
    { path: "/charts", icon: LineChart, label: "Charts" },
    { path: "/ai-analytics", icon: Brain, label: "AI Analysis" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  if (user?.role === "admin") {
    menuItems.push({ path: "/admin/analytics", icon: ShieldAlert, label: "Admin Panel" })
  }

  const isCollapsed = !isMobile && collapsed

  return (
    <>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "rgba(5,5,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--glass-border)", width: "100%", zIndex: 90, position: "sticky", top: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart2 size={22} color="var(--accent-blue)" />
            <span className="gradient-text" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>ExcelAnalytics</span>
          </div>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", display: "flex", padding: "4px" }}>
            <Menu size={24} />
          </button>
        </div>
      )}

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 95, backdropFilter: "blur(4px)" }} />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isMobile ? 260 : (collapsed ? 80 : 250), x: isMobile ? (mobileOpen ? 0 : -300) : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sidebar"
      >
        {/* Header */}
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between", borderBottom: "1px solid var(--glass-border)", height: "73px" }}>
          <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart2 size={26} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="gradient-text" style={{ fontWeight: "bold", fontSize: "1.15rem", whiteSpace: "nowrap" }}>
                  ExcelAnalytics
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "var(--text-secondary)", cursor: "pointer", display: "flex", padding: "8px", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }} onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
              <X size={22} />
            </button>
          )}
        </div>

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button onClick={() => setCollapsed(!collapsed)} style={{ position: "absolute", top: "24px", right: "-12px", background: "var(--glass-bg-strong)", border: "1px solid var(--glass-border)", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)", zIndex: 10, backdropFilter: "blur(12px)" }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "16px 8px", overflowY: "auto", overflowX: "hidden" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            {menuItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link to={item.path} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "10px", textDecoration: "none", background: active ? "rgba(76,132,255,0.1)" : "transparent", color: active ? "var(--accent-blue)" : "var(--text-secondary)", transition: "all 0.2s", justifyContent: isCollapsed ? "center" : "flex-start", boxShadow: active ? "inset 3px 0 0 0 var(--accent-blue)" : "none", fontWeight: active ? 600 : 500 }}
                    onMouseOver={(e) => { if (!active) e.currentTarget.style.background = "rgba(76,132,255,0.05)" }}
                    onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent" }}
                  >
                    <item.icon size={20} style={{ flexShrink: 0, color: active ? "var(--accent-blue)" : "var(--text-muted)" }} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} style={{ whiteSpace: "nowrap" }}>
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 8px", borderTop: "1px solid var(--glass-border)" }}>
          <button onClick={() => { logout(); navigate("/"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "10px", background: "transparent", border: "none", color: "var(--error-color)", cursor: "pointer", transition: "all 0.2s", justifyContent: isCollapsed ? "center" : "flex-start" }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,92,92,0.06)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Logout</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
