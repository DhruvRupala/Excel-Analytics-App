import { Link } from "react-router-dom"
import { BarChart2 } from "lucide-react"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div style={{ paddingRight: "40px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "bold", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <BarChart2 size={22} color="var(--accent-blue)" />
              <span className="gradient-text">ExcelAnalytics</span>
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
              Deploying enterprise-grade analytics and beautiful visualization for your data teams globally.
            </p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/security">Security</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/support">Help Center</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", gap: "16px", textAlign: "center" }}>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ExcelAnalytics. All rights reserved.</p>
          <p style={{ margin: 0, color: "var(--accent-blue)", fontWeight: 500 }}>Developed by Dhruv Rupala</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Privacy</Link>
            <Link to="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
