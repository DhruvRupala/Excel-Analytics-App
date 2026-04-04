const processAIData = (data, instruction) => {
  if (!data || !data.headers || !data.rows || !instruction) {
    return { error: "Invalid data or AI instruction provided." }
  }

  const { headers, rows } = data
  const { operation, groupByColumn, aggregateColumn, aggregationType, filterColumn, filterValue } = instruction

  let processedRows = [...rows]

  // Step 1: Apply Filter (if any)
  if (filterColumn && filterValue !== undefined) {
    const filterColIndex = headers.indexOf(filterColumn)
    if (filterColIndex === -1) {
      return { error: `Filter column '${filterColumn}' not found.` }
    }
    processedRows = processedRows.filter(
      (row) => String(row[filterColIndex]).toLowerCase() === String(filterValue).toLowerCase(),
    )
  }

  // Step 2: Perform Operation
  switch (operation) {
    case "group_by_and_aggregate":
      if (!groupByColumn || !aggregateColumn || !aggregationType) {
        return { error: "Missing parameters for group_by_and_aggregate operation." }
      }

      const groupColIndex = headers.indexOf(groupByColumn)
      const aggColIndex = headers.indexOf(aggregateColumn)

      if (groupColIndex === -1 || aggColIndex === -1) {
        return { error: `Group by column '${groupByColumn}' or aggregate column '${aggregateColumn}' not found.` }
      }

      const groupedData = new Map()

      processedRows.forEach((row) => {
        const groupKey = row[groupColIndex]
        const aggValue = Number.parseFloat(String(row[aggColIndex]).trim())

        if (groupKey !== null && groupKey !== undefined && groupKey !== "" && !isNaN(aggValue)) {
          if (!groupedData.has(groupKey)) {
            groupedData.set(groupKey, { sum: 0, count: 0, values: [] })
          }
          const current = groupedData.get(groupKey)
          current.sum += aggValue
          current.count += 1
          current.values.push(aggValue)
        }
      })

      const results = Array.from(groupedData.entries()).map(([key, { sum, count, values }]) => {
        let resultValue
        switch (aggregationType) {
          case "sum":
            resultValue = sum
            break
          case "average":
            resultValue = count > 0 ? sum / count : 0
            break
          case "count":
            resultValue = count
            break
          case "min":
            resultValue = values.length > 0 ? Math.min(...values) : null
            break
          case "max":
            resultValue = values.length > 0 ? Math.max(...values) : null
            break
          default:
            resultValue = sum // Default to sum
        }
        return { [groupByColumn]: key, [aggregateColumn]: resultValue }
      })
      return { headers: [groupByColumn, aggregateColumn], rows: results }

    case "summarize":
      // This operation might be handled more by the AI's text generation directly
      // For now, we'll just return basic stats if no specific aggregation is requested
      return {
        summary: `The file contains ${rows.length} rows and ${headers.length} columns.`,
        headers: headers,
        rows: processedRows.slice(0, 5), // Return first 5 rows as a sample
      }

    case "get_top_n":
      if (!aggregateColumn || !groupByColumn || !instruction.n) {
        return { error: "Missing parameters for get_top_n operation." }
      }
      const topN = Number.parseInt(instruction.n)
      if (isNaN(topN) || topN <= 0) {
        return { error: "Invalid N value for get_top_n operation." }
      }

      const topNGroupColIndex = headers.indexOf(groupByColumn)
      const topNAggColIndex = headers.indexOf(aggregateColumn)

      if (topNGroupColIndex === -1 || topNAggColIndex === -1) {
        return {
          error: `Group by column '${groupByColumn}' or aggregate column '${aggregateColumn}' not found for top N.`,
        }
      }

      const topNDataMap = new Map()
      processedRows.forEach((row) => {
        const groupKey = row[topNGroupColIndex]
        const aggValue = Number.parseFloat(String(row[topNAggColIndex]).trim())
        if (groupKey !== null && groupKey !== undefined && groupKey !== "" && !isNaN(aggValue)) {
          topNDataMap.set(groupKey, (topNDataMap.get(groupKey) || 0) + aggValue)
        }
      })

      const topNResults = Array.from(topNDataMap.entries())
        .map(([key, value]) => ({ [groupByColumn]: key, [aggregateColumn]: value }))
        .sort((a, b) => b[aggregateColumn] - a[aggregateColumn])
        .slice(0, topN)

      return { headers: [groupByColumn, aggregateColumn], rows: topNResults }

    default:
      return { error: "Unsupported AI operation." }
  }
}

module.exports = processAIData
