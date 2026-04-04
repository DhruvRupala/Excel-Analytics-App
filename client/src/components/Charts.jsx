"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import Plot from "react-plotly.js" // Import Plotly
import Sidebar from "./Sidebar"
import { useAuth } from "../context/authContext"

const Charts = () => {
  const { token } = useAuth()
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileData, setFileData] = useState(null)
  const [fileAnalytics, setFileAnalytics] = useState(null) // New state for analytics
  const [chartConfig, setChartConfig] = useState({
    type: "bar",
    xAxis: "",
    yAxis: "",
    zAxis: "", // New for 3D charts
  })
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)

  // Updated COLORS for dark theme compatibility
  const COLORS = ["#FFCE56", "#36A2EB", "#FF6384", "#8E44AD", "#00C896", "#4C84FF"] // Vibrant tones from the new theme

  useEffect(() => {
    fetchFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch((process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000") + "/api/files", {
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
    } finally {
      setLoading(false)
    }
  }

  const fetchFileData = async (fileId) => {
    setDataLoading(true)
    try {
      const response = await fetch(`${process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000"}/api/files/${fileId}/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFileData(data)
        // Also fetch analytics for column types
        await fetchFileAnalytics(fileId)
        // Reset chart config when new file is selected
        setChartConfig({
          type: "bar",
          xAxis: data.headers?.[0] || "",
          yAxis: data.headers?.[1] || "",
          zAxis: "", // Reset zAxis
        })
      }
    } catch (error) {
      console.error("Error fetching file data:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const fetchFileAnalytics = async (fileId) => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000"}/api/files/${fileId}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setFileAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching file analytics for charts:", error)
    }
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    fetchFileData(file._id)
  }

  const prepareChartData = () => {
    if (!fileData || !chartConfig.xAxis || !chartConfig.yAxis) {
      console.log("Chart data preparation skipped: Missing fileData, xAxis, or yAxis.")
      return []
    }

    const xIndex = fileData.headers.indexOf(chartConfig.xAxis)
    const yIndex = fileData.headers.indexOf(chartConfig.yAxis)

    if (xIndex === -1 || yIndex === -1) {
      console.log(
        `Chart data preparation skipped: X-axis ('${chartConfig.xAxis}') or Y-axis ('${chartConfig.yAxis}') column not found.`,
      )
      return []
    }

    if (chartConfig.type === "3dScatter") {
      if (!chartConfig.zAxis) {
        console.log("Chart data preparation skipped: Missing zAxis for 3D Scatter.")
        return []
      }
      const zIndex = fileData.headers.indexOf(chartConfig.zAxis)
      if (zIndex === -1) {
        console.log(`Chart data preparation skipped: Z-axis ('${chartConfig.zAxis}') column not found.`)
        return []
      }

      const scatterData = []
      fileData.rows.forEach((row, rowIndex) => {
        const xVal = String(row[xIndex]).trim()
        const yVal = String(row[yIndex]).trim()
        const zVal = String(row[zIndex]).trim()

        const numX = Number.parseFloat(xVal)
        const numY = Number.parseFloat(yVal)
        const numZ = Number.parseFloat(zVal)

        if (!isNaN(numX) && !isNaN(numY) && !isNaN(numZ)) {
          scatterData.push({ x: numX, y: numY, z: numZ })
        } else {
          console.log(
            `Skipping row ${rowIndex + 1} for 3D Scatter: Non-numeric value found in X ('${xVal}'), Y ('${yVal}'), or Z ('${zVal}').`,
          )
        }
      })
      return scatterData
    } else {
      // Existing 2D chart logic
      const dataMap = new Map()

      console.log(`Preparing chart data for X-axis: '${chartConfig.xAxis}', Y-axis: '${chartConfig.yAxis}'`)

      fileData.rows.forEach((row, rowIndex) => {
        const xValue = row[xIndex]
        const rawYValue = row[yIndex]
        // Convert to string and trim before parsing to handle potential whitespace or non-string types
        const yValue = Number.parseFloat(String(rawYValue).trim())

        if (xValue !== null && xValue !== undefined && xValue !== "" && !isNaN(yValue)) {
          if (dataMap.has(xValue)) {
            dataMap.set(xValue, dataMap.get(xValue) + yValue)
          } else {
            dataMap.set(xValue, yValue)
          }
        } else {
          console.log(
            `Skipping row ${rowIndex + 1}: X-value ('${xValue}') is empty or Y-value ('${rawYValue}') is not a valid number (parsed as ${yValue}).`,
          )
        }
      })

      const preparedData = Array.from(dataMap.entries())
        .map(([name, value]) => ({
          name: String(name),
          value: value,
        }))
        .slice(0, 20) // Limit to 20 items for better visualization

      console.log("Prepared chart data:", preparedData)
      return preparedData
    }
  }

  const renderChart = () => {
    const data = prepareChartData()

    if (dataLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )
    }

    if (!fileData) {
      return (
        <div className="empty-chart">
          <p>Select a file to create charts</p>
        </div>
      )
    }

    if (fileData.rows.length === 0) {
      return (
        <div className="empty-chart">
          <p>The selected file contains no data rows.</p>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="empty-chart">
          <p>No data available for the selected configuration. Check console for details.</p>
          <p>Ensure Y-axis column contains valid numbers and X-axis column is not empty.</p>
        </div>
      )
    }

    switch (chartConfig.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /> {/* Darker grid */}
              <XAxis dataKey="name" stroke="var(--text-secondary)" /> {/* Lighter axis text */}
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />{" "}
              {/* Dark tooltip */}
              <Legend />
              <Bar dataKey="value" fill="var(--accent-color)" /> {/* Accent color for bars */}
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="var(--accent-color)" // Accent color
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /> {/* Darker grid */}
              <XAxis dataKey="name" stroke="var(--text-secondary)" /> {/* Lighter axis text */}
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="var(--accent-color)" /> {/* Accent color for line */}
            </LineChart>
          </ResponsiveContainer>
        )

      case "3dScatter":
        const trace = {
          x: data.map((d) => d.x),
          y: data.map((d) => d.y),
          z: data.map((d) => d.z),
          mode: "markers",
          marker: {
            size: 6,
            opacity: 0.8,
            color: "var(--accent-color)", // Accent color for markers
          },
          type: "scatter3d",
        }

        const layout = {
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 0 },
          paper_bgcolor: "#1a1a2e", // Hardcoded deep dark blue for the entire plot area
          plot_bgcolor: "#1a1a2e", // Hardcoded deep dark blue for the 3D plot itself
          font: {
            color: "#e0e0e0", // Hardcoded light font color for all text
          },
          scene: {
            xaxis: {
              title: chartConfig.xAxis,
              backgroundcolor: "#2a2a4a", // Hardcoded lighter dark blue for X-axis plane
              gridcolor: "#444466", // Hardcoded subtle grid lines
              zerolinecolor: "#a0a0a0", // Hardcoded zero line color
              showbackground: true,
            },
            yaxis: {
              title: chartConfig.yAxis,
              backgroundcolor: "#2a2a4a", // Hardcoded lighter dark blue for Y-axis plane
              gridcolor: "#444466",
              zerolinecolor: "#a0a0a0",
              showbackground: true,
            },
            zaxis: {
              title: chartConfig.zAxis,
              backgroundcolor: "#2a2a4a", // Hardcoded lighter dark blue for Z-axis plane
              gridcolor: "#444466",
              zerolinecolor: "#a0a0a0",
              showbackground: true,
            },
            bgcolor: "#1a1a2e", // Ensure the scene background is also deep dark blue
          },
          hovermode: "closest",
        }

        return (
          <ResponsiveContainer width="100%" height="100%">
            <Plot data={[trace]} layout={layout} useResizeHandler={true} style={{ width: "100%", height: "100%" }} />
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  // Filter numeric headers for Y-Axis and Z-Axis dropdowns
  const numericHeaders = fileAnalytics?.columnStats.filter((col) => col.type === "number").map((col) => col.name) || []

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <div className="charts-container">
          <div className="charts-header">
            <h1>Charts</h1>
            <p>Create interactive visualizations from your Excel data</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading files...</p>
            </div>
          ) : (
            <div className="charts-content">
              <div className="chart-controls">
                <div className="control-group">
                  <label>Select File:</label>
                  <select
                    value={selectedFile?._id || ""}
                    onChange={(e) => {
                      const file = files.find((f) => f._id === e.target.value)
                      if (file) handleFileSelect(file)
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

                {selectedFile &&
                  fileData && ( // Only show controls if a file is selected and data is loaded
                    <>
                      <div className="control-group">
                        <label>Chart Type:</label>
                        <select
                          value={chartConfig.type}
                          onChange={(e) => setChartConfig({ ...chartConfig, type: e.target.value, zAxis: "" })} // Reset zAxis when type changes
                          className="control-select"
                        >
                          <option value="bar">Bar Chart</option>
                          <option value="pie">Pie Chart</option>
                          <option value="line">Line Chart</option>
                          <option value="3dScatter">3D Scatter Plot</option> {/* New 3D option */}
                        </select>
                      </div>

                      <div className="control-group">
                        <label>X-Axis (Categories/Values):</label>
                        <select
                          value={chartConfig.xAxis}
                          onChange={(e) => setChartConfig({ ...chartConfig, xAxis: e.target.value })}
                          className="control-select"
                        >
                          <option value="">Select column...</option>
                          {fileData.headers.map((header, index) => (
                            <option key={index} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label>Y-Axis (Values):</label>
                        <select
                          value={chartConfig.yAxis}
                          onChange={(e) => setChartConfig({ ...chartConfig, yAxis: e.target.value })}
                          className="control-select"
                        >
                          <option value="">Select column...</option>
                          {/* For 3D scatter, Y-axis should also be numeric */}
                          {(chartConfig.type === "3dScatter" ? numericHeaders : fileData.headers).map(
                            (header, index) => (
                              <option key={index} value={header}>
                                {header}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {chartConfig.type === "3dScatter" && ( // Show Z-Axis only for 3D Scatter
                        <div className="control-group">
                          <label>Z-Axis (Values):</label>
                          <select
                            value={chartConfig.zAxis}
                            onChange={(e) => setChartConfig({ ...chartConfig, zAxis: e.target.value })}
                            className="control-select"
                          >
                            <option value="">Select column...</option>
                            {numericHeaders.map((header, index) => (
                              <option key={index} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  )}
              </div>

              {selectedFile && (
                <div className="chart-display">
                  <div className="chart-header">
                    <h3>
                      {selectedFile.filename} - {chartConfig.type.charAt(0).toUpperCase() + chartConfig.type.slice(1)}{" "}
                      Chart
                    </h3>
                    {chartConfig.xAxis && chartConfig.yAxis && (
                      <p>
                        {chartConfig.xAxis} vs {chartConfig.yAxis}
                        {chartConfig.type === "3dScatter" && chartConfig.zAxis && ` vs ${chartConfig.zAxis}`}
                      </p>
                    )}
                  </div>

                  <div className="chart-wrapper">{renderChart()}</div>
                </div>
              )}

              {!selectedFile && files.length > 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📈</div>
                  <h3>Select a file to create charts</h3>
                  <p>Choose a file from the dropdown above to start creating visualizations</p>
                </div>
              )}

              {files.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📁</div>
                  <h3>No files uploaded</h3>
                  <p>
                    <a href="/upload">Upload your first Excel file</a> to create charts
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Charts
