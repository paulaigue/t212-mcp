export interface Pie {
  cash: number,
  dividendDetails: {
    gained: number,
    inCash: number,
    reinvested: 0
  },
  id: number,
  progress: 0.5,
  result: {
    priceAvgInvestedValue: number,
    priceAvgResult: number,
    priceAvgResultCoef: number,
    priceAvgValue: 0
  },
  status: "AHEAD" | "ON_TRACK" | "BEHIND",
}