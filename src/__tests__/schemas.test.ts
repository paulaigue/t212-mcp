import { describe, it, expect } from "vitest"
import {
  PositionSchema, PositionArraySchema,
  PieSchema, PieArraySchema,
  AccountCashSchema, AccountMetadataSchema,
} from "../models/schemas.js"

describe("PositionSchema", () => {
  const validPosition = {
    averagePrice: 150.25,
    currentPrice: 155.00,
    frontend: "API",
    fxPpl: 0.5,
    initialFillDate: "2024-01-15T10:30:00Z",
    maxBuy: 100,
    maxSell: 50,
    pieQuantity: 10,
    ppl: 4.75,
    quantity: 25,
    ticker: "AAPL_US_EQ",
  }

  it("accepts a valid position", () => {
    const result = PositionSchema.safeParse(validPosition)
    expect(result.success).toBe(true)
  })

  it("accepts all valid frontend values", () => {
    for (const frontend of ["API", "IOS", "ANDROID", "WEB", "SYSTEM", "AUTOINVEST"]) {
      const result = PositionSchema.safeParse({ ...validPosition, frontend })
      expect(result.success).toBe(true)
    }
  })

  it("rejects invalid frontend value", () => {
    const result = PositionSchema.safeParse({ ...validPosition, frontend: "DESKTOP" })
    expect(result.success).toBe(false)
  })

  it("rejects missing required field", () => {
    const { ticker, ...incomplete } = validPosition
    const result = PositionSchema.safeParse(incomplete)
    expect(result.success).toBe(false)
  })

  it("rejects wrong type for numeric field", () => {
    const result = PositionSchema.safeParse({ ...validPosition, averagePrice: "not-a-number" })
    expect(result.success).toBe(false)
  })

  it("rejects null input", () => {
    expect(PositionSchema.safeParse(null).success).toBe(false)
  })

  it("rejects undefined input", () => {
    expect(PositionSchema.safeParse(undefined).success).toBe(false)
  })
})

describe("PositionArraySchema", () => {
  const validPosition = {
    averagePrice: 150.25,
    currentPrice: 155.00,
    frontend: "API",
    fxPpl: 0.5,
    initialFillDate: "2024-01-15T10:30:00Z",
    maxBuy: 100,
    maxSell: 50,
    pieQuantity: 10,
    ppl: 4.75,
    quantity: 25,
    ticker: "AAPL_US_EQ",
  }

  it("accepts empty array", () => {
    expect(PositionArraySchema.safeParse([]).success).toBe(true)
  })

  it("accepts array of valid positions", () => {
    expect(PositionArraySchema.safeParse([validPosition, validPosition]).success).toBe(true)
  })

  it("rejects array with one invalid position", () => {
    const invalid = { ...validPosition, frontend: "INVALID" }
    expect(PositionArraySchema.safeParse([validPosition, invalid]).success).toBe(false)
  })

  it("rejects non-array input", () => {
    expect(PositionArraySchema.safeParse(validPosition).success).toBe(false)
  })
})

describe("PieSchema", () => {
  const validPie = {
    cash: 1000.50,
    dividendDetails: {
      gained: 50.25,
      inCash: 30.00,
      reinvested: 20.25,
    },
    id: 12345,
    progress: 0.75,
    result: {
      priceAvgInvestedValue: 5000,
      priceAvgResult: 250,
      priceAvgResultCoef: 0.05,
      priceAvgValue: 5250,
    },
    status: "ON_TRACK",
  }

  it("accepts a valid pie", () => {
    expect(PieSchema.safeParse(validPie).success).toBe(true)
  })

  it("accepts all valid status values", () => {
    for (const status of ["AHEAD", "ON_TRACK", "BEHIND"]) {
      expect(PieSchema.safeParse({ ...validPie, status }).success).toBe(true)
    }
  })

  it("rejects invalid status", () => {
    expect(PieSchema.safeParse({ ...validPie, status: "UNKNOWN" }).success).toBe(false)
  })

  it("rejects missing nested field", () => {
    const bad = { ...validPie, dividendDetails: { gained: 50, inCash: 30 } }
    expect(PieSchema.safeParse(bad).success).toBe(false)
  })
})

describe("PieArraySchema", () => {
  it("accepts empty array", () => {
    expect(PieArraySchema.safeParse([]).success).toBe(true)
  })
})

describe("AccountCashSchema", () => {
  const validCash = {
    free: 5000,
    blocked: 200,
    invested: 15000,
    ppl: 1200,
    total: 21400,
  }

  it("accepts valid account cash", () => {
    expect(AccountCashSchema.safeParse(validCash).success).toBe(true)
  })

  it("rejects missing field", () => {
    const { total, ...incomplete } = validCash
    expect(AccountCashSchema.safeParse(incomplete).success).toBe(false)
  })

  it("rejects string instead of number", () => {
    expect(AccountCashSchema.safeParse({ ...validCash, free: "5000" }).success).toBe(false)
  })
})

describe("AccountMetadataSchema", () => {
  const validMeta = {
    currency: "USD",
    id: 42,
    name: "My Account",
    type: "LIVE",
  }

  it("accepts valid metadata", () => {
    expect(AccountMetadataSchema.safeParse(validMeta).success).toBe(true)
  })

  it("rejects missing name", () => {
    const { name, ...incomplete } = validMeta
    expect(AccountMetadataSchema.safeParse(incomplete).success).toBe(false)
  })

  it("rejects number for currency", () => {
    expect(AccountMetadataSchema.safeParse({ ...validMeta, currency: 123 }).success).toBe(false)
  })
})
