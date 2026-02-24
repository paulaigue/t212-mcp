export interface Pie {
  cash: number,
  dividendDetails: {
    gained: number,
    inCash: number,
    reinvested: number
  },
  id: number,
  progress: number,
  result: {
    priceAvgInvestedValue: number,
    priceAvgResult: number,
    priceAvgResultCoef: number,
    priceAvgValue: number
  },
  status: "AHEAD" | "ON_TRACK" | "BEHIND",
}
