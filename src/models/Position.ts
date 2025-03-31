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