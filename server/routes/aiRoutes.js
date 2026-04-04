const express = require("express")
const { generateText, streamText } = require("ai")
const { openai } = require("@ai-sdk/openai")
const { protect } = require("../middleware/userMiddleware")
const File = require("../model/fileModel")
const processAIData = require("../utils/aiDataProcessor") // Import the data processor

const router = express.Router()

// @desc    Process natural language query for data analysis
// @route   POST /api/ai/query
// @access  Private
router.post("/query", protect, async (req, res) => {
  const { fileId, query } = req.body

  if (!fileId || !query) {
    return res.status(400).json({ message: "File ID and query are required." })
  }

  try {
    const file = await File.findOne({ _id: fileId, uploadedBy: req.user.id })

    if (!file) {
      return res.status(404).json({ message: "File not found or you do not have permission to access it." })
    }

    if (file.processingStatus !== "completed") {
      return res.status(400).json({ message: "File is still being processed. Please wait." })
    }

    const fileHeaders = file.data.headers
    const fileRows = file.data.rows

    // Step 1: Use AI to determine the intent and parameters for data processing
    const { text: aiResponse } = await generateText({
      model: openai("gpt-4o-mini"), // Using a smaller model for cost-effectiveness and speed
      system: `You are a data analysis assistant. Your task is to interpret user questions about an Excel dataset and output a JSON object that describes the data operation to be performed.
      The available columns are: ${JSON.stringify(fileHeaders)}.
      
      Available operations:
      - "group_by_and_aggregate": For questions like "average salary by department", "total sales per region".
        Requires: "groupByColumn" (string, must be one of the available columns), "aggregateColumn" (string, must be one of the available columns, preferably numeric), "aggregationType" (string: "sum", "average", "count", "min", "max").
      - "summarize": For general questions about the data, like "tell me about the data", "what's in this file".
      - "get_top_n": For questions like "top 5 employees by salary", "highest sales".
        Requires: "groupByColumn" (string, the category column), "aggregateColumn" (string, the value column, must be numeric), "n" (number, how many top items).
      - "filter_and_summarize": For questions like "employees in sales department", "data for Q1".
        Requires: "filterColumn" (string), "filterValue" (string or number). Can be combined with "group_by_and_aggregate" or "summarize" after filtering.

      If the user asks a question that cannot be directly translated into one of these operations or requires complex interpretation, respond with a "natural_language_response" operation and a "response" field containing a helpful text explanation.
      
      Output only the JSON object. Do not include any other text or markdown outside the JSON.
      Example for "average salary by department":
      {"operation": "group_by_and_aggregate", "groupByColumn": "Department", "aggregateColumn": "Salary", "aggregationType": "average"}
      Example for "tell me about the data":
      {"operation": "summarize"}
      Example for "top 3 sales people by revenue":
      {"operation": "get_top_n", "groupByColumn": "Sales Person", "aggregateColumn": "Revenue", "n": 3}
      Example for "employees in sales department":
      {"operation": "filter_and_summarize", "filterColumn": "Department", "filterValue": "Sales"}
      Example for "What is the highest salary?":
      {"operation": "group_by_and_aggregate", "groupByColumn": "EmployeeID", "aggregateColumn": "Salary", "aggregationType": "max"}
      `,
      prompt: query,
      temperature: 0, // Keep low for structured output
      response_format: { type: "json_object" },
    })

    let aiInstruction
    try {
      aiInstruction = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", aiResponse, parseError)
      return res
        .status(500)
        .json({ message: "AI could not generate a valid data operation. Please try rephrasing your query." })
    }

    let resultData = {}
    let naturalLanguageExplanation = ""

    if (aiInstruction.operation === "natural_language_response") {
      naturalLanguageExplanation = aiInstruction.response
    } else {
      // Step 2: Process data based on AI instruction
      const processedResult = processAIData(file.data, aiInstruction)

      if (processedResult.error) {
        // If data processing fails, ask AI to explain why or provide a general response
        const { text: fallbackExplanation } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: `The user asked "${query}" about a dataset with headers ${JSON.stringify(fileHeaders)}. I tried to process it with the instruction ${JSON.stringify(aiInstruction)} but got an error: "${processedResult.error}". Please provide a user-friendly explanation of why this query might not work or suggest how to rephrase it, or provide a general summary if the query was too complex.`,
          temperature: 0.5,
        })
        naturalLanguageExplanation = fallbackExplanation
        resultData = { error: processedResult.error } // Keep the technical error for debugging
      } else {
        resultData = processedResult

        // Step 3: Use AI to generate a natural language explanation of the results
        const { text: explanation } = await generateText({
          model: openai("gpt-4o-mini"),
          system: `You are a data analysis assistant. Explain the following data analysis result in a concise, user-friendly way.
          Original query: "${query}"
          Data headers: ${JSON.stringify(resultData.headers)}
          Data rows (first 5): ${JSON.stringify(resultData.rows.slice(0, 5))}
          Total results: ${resultData.rows.length}
          `,
          prompt: `Explain the results of the analysis for the query: "${query}".`,
          temperature: 0.7,
        })
        naturalLanguageExplanation = explanation
      }
    }

    res.json({
      message: "AI query processed successfully",
      aiInstruction, // For debugging/understanding AI's intent
      naturalLanguageExplanation,
      resultData,
    })
  } catch (error) {
    console.error("AI query processing error:", error)
    res.status(500).json({ message: "Server error processing AI query.", error: error.message })
  }
})

module.exports = router
