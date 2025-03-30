
export interface Position {
  averagePrice: number,
  currentPrice: number,
  frontend: "API" | "IOS" | "ANDROID" | "WEB" | "SYSTEM" | "AUTOINVEST",
  fxPpl: number,
  initialFillDate: string, // 2019-08-24T14:15:22Z,
  maxBuy: number,
  maxSell: number,
  pieQuantity: number,
  ppl: number,
  quantity: number,
  ticker: string
}

export const mapPosition = (position: Position) => {
  const profitLossPercent = (position.ppl * 100).toFixed(2);
  const formattedCurrentPrice = position.currentPrice.toFixed(2);
  const formattedAvgPrice = position.averagePrice.toFixed(2);

  return [
    {
      type: "text" as const,
      text: `Ticker: ${position.ticker}`
    },
    {
      type: "text" as const,
      text: `Average Price: $${formattedAvgPrice}`
    },
    {
      type: "text" as const,
      text: `Current Price: $${formattedCurrentPrice}`
    },
    {
      type: "text" as const,
      text: `Frontend: ${position.frontend}`
    },
    {
      type: "text" as const,
      text: `FX P/L: ${(position.fxPpl * 100).toFixed(2)}%`
    },
    {
      type: "text" as const,
      text: `Initial Fill Date: ${position.initialFillDate}`
    },
    {
      type: "text" as const,
      text: `Max Buy: ${position.maxBuy}`
    },
    {
      type: "text" as const,
      text: `Max Sell: ${position.maxSell}`
    },
    {
      type: "text" as const,
      text: `Pie Quantity: ${position.pieQuantity}`
    },
    {
      type: "text" as const,
      text: `P/L: ${profitLossPercent}%`
    },
    {
      type: "text" as const,
      text: `Quantity: ${position.quantity}`
    }
  ]
}