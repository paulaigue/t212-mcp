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

export const mapPie = (pie: Pie) => {
  return [
    {
      type: "text" as const,
      text: `Cash: ${pie.cash}`
    },
    {
      type: "text" as const,
      text: `Dividend Gained: ${pie.dividendDetails.gained}`
    },
    {
      type: "text" as const,
      text: `Dividend in Cash: ${pie.dividendDetails.inCash}`
    },
    {
      type: "text" as const,
      text: `Dividend Reinvested: ${pie.dividendDetails.reinvested}`
    },
    {
      type: "text" as const,
      text: `ID: ${pie.id}`
    },
    {
      type: "text" as const,
      text: `Progress: ${(pie.progress * 100).toFixed(1)}%`
    },
    {
      type: "text" as const,
      text: `Average Invested Value: ${pie.result.priceAvgInvestedValue}`
    },
    {
      type: "text" as const,
      text: `Average Result: ${pie.result.priceAvgResult}`
    },
    {
      type: "text" as const,
      text: `Result Coefficient: ${pie.result.priceAvgResultCoef}`
    },
    {
      type: "text" as const,
      text: `Average Value: ${pie.result.priceAvgValue}`
    },
    {
      type: "text" as const,
      text: `Status: ${pie.status}`
    }
  ]
}