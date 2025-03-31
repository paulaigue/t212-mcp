import { fetchAllPies, fetchOpenPositions, fetchPosition } from "./api/api.js"
import { mapToolResponse } from "./tools/MCPTool.js"

export const runDebug = async () => {
  console.log("\n-- Fetch open position:")
  const positions = await fetchOpenPositions()
  displayResult(positions)
  
  console.log("\n-- Fetch position TTWO_US_EQ:")
  const position = await fetchPosition("TTWO_US_EQ")
  displayResult(position)

  console.log("\n-- Fetch all Pies:")
  const pies = await fetchAllPies()
  displayResult(pies)
}

const displayResult = (result: any) => {
  if (result !== null) {
    mapToolResponse(result).forEach(content => {      
      console.log(content.text)    
    })
  } else {
    console.log("Result is NULL")
  }
}