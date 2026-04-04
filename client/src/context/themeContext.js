"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'modern-dark'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app-theme") || "modern-dark"
    }
    return "modern-dark"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement
      // Remove existing theme classes
      root.classList.remove("modern-dark-theme", "classic-dark-theme")
      // Add the current theme class
      root.classList.add(`${theme}-theme`)
      // Persist theme preference
      localStorage.setItem("app-theme", theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "modern-dark" ? "classic-dark" : "modern-dark"))
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
