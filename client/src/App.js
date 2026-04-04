import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/authContext"
import { ThemeProvider } from "./context/themeContext"
import StarfieldBackground from "./components/StarfieldBackground"
import Home from "./components/Home"
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import Dashboard from "./components/Dashboard"
import Upload from "./components/Upload"
import Analytics from "./components/Analytics"
import Charts from "./components/Charts"
import Profile from "./components/Profile"
import Settings from "./components/Settings"
import ViewData from "./components/ViewData"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"
import AIAnalytics from "./components/AIAnalytics"
import AdminAnalytics from "./components/AdminAnalytics"
import "./input.css"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <StarfieldBackground />
          <div className="App" style={{ position: "relative", zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/view-data" element={<ProtectedRoute><ViewData /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/ai-analytics" element={<ProtectedRoute><AIAnalytics /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
