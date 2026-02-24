import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Mock the logger to avoid noisy output in tests
vi.mock("../logger.js", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// We need to set env before importing the module
process.env.T212_API_KEY = "test-api-key-12345"

const VALID_POSITION = {
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

const VALID_ACCOUNT_CASH = {
  free: 5000,
  blocked: 200,
  invested: 15000,
  ppl: 1200,
  total: 21400,
}

const VALID_ACCOUNT_METADATA = {
  currency: "USD",
  id: 42,
  name: "Test Account",
  type: "LIVE",
}

const VALID_PIE = {
  cash: 1000.50,
  dividendDetails: { gained: 50, inCash: 30, reinvested: 20 },
  id: 123,
  progress: 0.75,
  result: {
    priceAvgInvestedValue: 5000,
    priceAvgResult: 250,
    priceAvgResultCoef: 0.05,
    priceAvgValue: 5250,
  },
  status: "ON_TRACK",
}

function mockFetchSuccess(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Headers({ "content-length": "500" }),
    text: () => Promise.resolve(JSON.stringify(data)),
  })
}

function mockFetchError(status: number) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    headers: new Headers(),
    text: () => Promise.resolve(""),
  })
}

describe("API layer", () => {
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.useRealTimers()
  })

  describe("fetchOpenPositions", () => {
    it("returns validated positions on success", async () => {
      globalThis.fetch = mockFetchSuccess([VALID_POSITION])
      const { fetchOpenPositions } = await import("../api/api.js")
      const result = await fetchOpenPositions()
      expect(result).toEqual([VALID_POSITION])
    })

    it("returns null when API response fails validation", async () => {
      const badData = [{ ...VALID_POSITION, frontend: "INVALID_FRONTEND" }]
      globalThis.fetch = mockFetchSuccess(badData)
      const mod = await import("../api/api.js")
      const result = await mod.fetchOpenPositions()
      expect(result).toBeNull()
    })
  })

  describe("fetchPosition", () => {
    it("URL-encodes the ticker parameter", async () => {
      const fetchMock = mockFetchSuccess(VALID_POSITION)
      globalThis.fetch = fetchMock
      const { fetchPosition } = await import("../api/api.js")
      await fetchPosition("AAPL_US_EQ")
      expect(fetchMock).toHaveBeenCalled()
      const url: string = fetchMock.mock.calls[0][0]
      expect(url).toContain("/equity/portfolio/AAPL_US_EQ")
    })

    it("encodes special characters in ticker", async () => {
      const fetchMock = mockFetchSuccess(VALID_POSITION)
      globalThis.fetch = fetchMock
      const { fetchPosition } = await import("../api/api.js")
      await fetchPosition("A/B")
      const url: string = fetchMock.mock.calls[0][0]
      expect(url).toContain("/equity/portfolio/A%2FB")
      expect(url).not.toContain("/equity/portfolio/A/B")
    })
  })

  describe("fetchAccountCash", () => {
    it("returns validated account cash on success", async () => {
      globalThis.fetch = mockFetchSuccess(VALID_ACCOUNT_CASH)
      const { fetchAccountCash } = await import("../api/api.js")
      const result = await fetchAccountCash()
      expect(result).toEqual(VALID_ACCOUNT_CASH)
    })
  })

  describe("fetchAccountMetadata", () => {
    it("returns validated metadata on success", async () => {
      globalThis.fetch = mockFetchSuccess(VALID_ACCOUNT_METADATA)
      const { fetchAccountMetadata } = await import("../api/api.js")
      const result = await fetchAccountMetadata()
      expect(result).toEqual(VALID_ACCOUNT_METADATA)
    })
  })

  describe("fetchAllPies", () => {
    it("returns validated pies on success", async () => {
      globalThis.fetch = mockFetchSuccess([VALID_PIE])
      const { fetchAllPies } = await import("../api/api.js")
      const result = await fetchAllPies()
      expect(result).toEqual([VALID_PIE])
    })
  })

  describe("HTTP error handling", () => {
    it("returns null on 401 (auth failure)", async () => {
      globalThis.fetch = mockFetchError(401)
      const { fetchOpenPositions } = await import("../api/api.js")
      const result = await fetchOpenPositions()
      expect(result).toBeNull()
    })

    it("returns null on 404 (not found)", async () => {
      globalThis.fetch = mockFetchError(404)
      const { fetchPosition } = await import("../api/api.js")
      const result = await fetchPosition("NONEXISTENT")
      expect(result).toBeNull()
    })

    it("returns null on 403 (forbidden)", async () => {
      globalThis.fetch = mockFetchError(403)
      const { fetchAccountCash } = await import("../api/api.js")
      const result = await fetchAccountCash()
      expect(result).toBeNull()
    })
  })

  describe("response size limit", () => {
    it("rejects responses exceeding size limit via content-length", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-length": "10000000" }), // 10MB
        text: () => Promise.resolve("{}"),
      })
      const { fetchOpenPositions } = await import("../api/api.js")
      const result = await fetchOpenPositions()
      expect(result).toBeNull()
    })
  })
})

describe("ApiError", () => {
  it("has correct name and properties", async () => {
    const { ApiError } = await import("../api/api.js")
    const err = new ApiError("test", 429, true)
    expect(err.name).toBe("ApiError")
    expect(err.message).toBe("test")
    expect(err.statusCode).toBe(429)
    expect(err.retryable).toBe(true)
  })

  it("defaults retryable to false", async () => {
    const { ApiError } = await import("../api/api.js")
    const err = new ApiError("test", 401)
    expect(err.retryable).toBe(false)
  })
})
