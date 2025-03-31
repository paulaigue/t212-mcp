import { fetchAllPies, fetchOpenPositions, fetchPosition } from "./api/api.js"

export const runDebug = async () => {
  console.log("\n-- Fetch open position:")
  const positions = await fetchOpenPositions()
  console.log(JSON.stringify(positions))
  
  console.log("\n-- Fetch position TTWO_US_EQ:")
  const position = await fetchPosition("TTWO_US_EQ")
  console.log(JSON.stringify(position))

  console.log("\n-- Fetch all Pies:")
  const pies = await fetchAllPies()
  console.log(JSON.stringify(pies))
}