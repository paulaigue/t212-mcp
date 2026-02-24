import { z } from "zod"

export const PositionSchema = z.object({
  averagePrice: z.number(),
  currentPrice: z.number(),
  frontend: z.enum(["API", "IOS", "ANDROID", "WEB", "SYSTEM", "AUTOINVEST"]),
  fxPpl: z.number(),
  initialFillDate: z.string(),
  maxBuy: z.number(),
  maxSell: z.number(),
  pieQuantity: z.number(),
  ppl: z.number(),
  quantity: z.number(),
  ticker: z.string(),
})

export const PositionArraySchema = z.array(PositionSchema)

export const PieSchema = z.object({
  cash: z.number(),
  dividendDetails: z.object({
    gained: z.number(),
    inCash: z.number(),
    reinvested: z.number(),
  }),
  id: z.number(),
  progress: z.number(),
  result: z.object({
    priceAvgInvestedValue: z.number(),
    priceAvgResult: z.number(),
    priceAvgResultCoef: z.number(),
    priceAvgValue: z.number(),
  }),
  status: z.enum(["AHEAD", "ON_TRACK", "BEHIND"]),
})

export const PieArraySchema = z.array(PieSchema)

export const AccountCashSchema = z.object({
  free: z.number(),
  blocked: z.number(),
  invested: z.number(),
  ppl: z.number(),
  total: z.number(),
})

export const AccountMetadataSchema = z.object({
  currency: z.string(),
  id: z.number(),
  name: z.string(),
  type: z.string(),
})
