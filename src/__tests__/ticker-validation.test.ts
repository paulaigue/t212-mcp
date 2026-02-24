import { describe, it, expect } from "vitest"
import { z } from "zod"

// Reproduce the ticker schema from FetchPositionTool
const tickerSchema = z.string()
  .min(1, "Ticker must not be empty")
  .max(20, "Ticker must not exceed 20 characters")
  .regex(/^[A-Za-z0-9._-]+$/, "Ticker contains invalid characters")

describe("Ticker input validation", () => {
  describe("valid tickers", () => {
    const validTickers = [
      "AAPL_US_EQ",
      "MSFT",
      "TSLA",
      "BRK.B",
      "SPY",
      "VOO",
      "AMZN_US_EQ",
      "A",
      "AB-CD.EF_GH",
    ]

    for (const ticker of validTickers) {
      it(`accepts "${ticker}"`, () => {
        expect(tickerSchema.safeParse(ticker).success).toBe(true)
      })
    }
  })

  describe("path traversal attacks", () => {
    const attacks = [
      "../../../etc/passwd",
      "..%2F..%2Fetc%2Fpasswd",
      "AAPL/../admin",
      "../../api/v0/equity",
      "AAPL/../../secret",
    ]

    for (const attack of attacks) {
      it(`rejects path traversal: "${attack}"`, () => {
        expect(tickerSchema.safeParse(attack).success).toBe(false)
      })
    }
  })

  describe("injection attacks", () => {
    const injections = [
      "AAPL%00MSFT",     // null byte
      "AAPL\nMSFT",      // newline injection
      "AAPL\rMSFT",      // carriage return
      "AAPL MSFT",       // space
      "AAPL&action=buy",  // parameter injection
      "AAPL?key=value",   // query string injection
      "AAPL#fragment",    // fragment injection
      "<script>",         // XSS
      "'; DROP TABLE--",  // SQL injection
    ]

    for (const injection of injections) {
      it(`rejects injection: "${injection}"`, () => {
        expect(tickerSchema.safeParse(injection).success).toBe(false)
      })
    }
  })

  describe("boundary conditions", () => {
    it("rejects empty string", () => {
      expect(tickerSchema.safeParse("").success).toBe(false)
    })

    it("accepts single character", () => {
      expect(tickerSchema.safeParse("A").success).toBe(true)
    })

    it("accepts exactly 20 characters", () => {
      expect(tickerSchema.safeParse("A".repeat(20)).success).toBe(true)
    })

    it("rejects 21 characters", () => {
      expect(tickerSchema.safeParse("A".repeat(21)).success).toBe(false)
    })

    it("rejects very long string (DoS prevention)", () => {
      expect(tickerSchema.safeParse("A".repeat(10000)).success).toBe(false)
    })
  })

  describe("type safety", () => {
    it("rejects number", () => {
      expect(tickerSchema.safeParse(123).success).toBe(false)
    })

    it("rejects null", () => {
      expect(tickerSchema.safeParse(null).success).toBe(false)
    })

    it("rejects undefined", () => {
      expect(tickerSchema.safeParse(undefined).success).toBe(false)
    })

    it("rejects object", () => {
      expect(tickerSchema.safeParse({ ticker: "AAPL" }).success).toBe(false)
    })

    it("rejects array", () => {
      expect(tickerSchema.safeParse(["AAPL"]).success).toBe(false)
    })
  })
})
