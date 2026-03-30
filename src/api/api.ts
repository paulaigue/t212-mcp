import type {Position} from "../models/Position.js"
import type {Pie} from "../models/Pie.js"
import type {AccountSummary} from "../models/Account.js"
import type {Instrument} from "../models/Instrument.js"
import type {Exchange} from "../models/Exchange.js"
import type {HistoricalOrder, PaginatedResponse} from "../models/HistoricalOrder.js"
import type {Dividend} from "../models/Dividend.js"
import type {Transaction} from "../models/Transaction.js"
import type {Export} from "../models/Export.js"

const ENVIRONMENT = process.env.T212_ENVIRONMENT === "demo" ? "demo" : "live"
const API_BASE = `https://${ENVIRONMENT}.trading212.com/api/v0`
const API_KEY = process.env.T212_API_KEY ?? ""
const API_SECRET = process.env.T212_API_SECRET ?? ""

const USER_AGENT = "T212-mcp/1.0"
const REQUEST_TIMEOUT_MS = 30_000

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchResource<T>(resourcePath: string): Promise<T | null> {
  if (API_KEY.length === 0) {
    throw new ApiError("No API key found. Set T212_API_KEY environment variable.")
  }
  if (API_SECRET.length === 0) {
    throw new ApiError("No API secret found. Set T212_API_SECRET environment variable.")
  }

  const credentials = btoa(`${API_KEY}:${API_SECRET}`)
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
    Authorization: `Basic ${credentials}`
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/${resourcePath}`, {
      headers,
      signal: controller.signal,
    })

    if (response.status === 429) {
      const retryAfter = response.headers.get("x-ratelimit-reset");
      const resetInfo = retryAfter ? ` Resets at ${new Date(Number(retryAfter) * 1000).toISOString()}.` : "";
      throw new ApiError(`Rate limited by Trading 212 API. Please wait and try again.${resetInfo}`, 429);
    }

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    return (await response.json() as T);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`, 408);
    }
    console.error(`Error while fetching ${resourcePath}: ${error}`)
    return null
  } finally {
    clearTimeout(timeoutId);
  }
}

export const fetchPositions: (ticker?: string) => Promise<Position[] | null> = async (ticker) => {
  const params = new URLSearchParams();
  if (ticker) params.set("ticker", ticker);
  const query = params.toString();
  return (await fetchResource(`equity/positions${query ? `?${query}` : ""}`))
}

export const fetchAllPies: () => Promise<[Pie] | null> = async () => {
  return (await fetchResource("equity/pies"))
}

export const fetchAccountSummary: () => Promise<AccountSummary | null> = async () => {
  return (await fetchResource("equity/account/summary"))
}

export const fetchInstruments: () => Promise<Instrument[] | null> = async () => {
  return (await fetchResource("equity/metadata/instruments"))
}

export const fetchExchanges: () => Promise<Exchange[] | null> = async () => {
  return (await fetchResource("equity/metadata/exchanges"))
}

export const fetchOrderHistory: (cursor?: string, ticker?: string, limit?: number) => Promise<PaginatedResponse<HistoricalOrder> | null> = async (cursor, ticker, limit = 20) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  if (ticker) params.set("ticker", ticker);
  return (await fetchResource(`equity/history/orders?${params.toString()}`))
}

export const fetchDividendHistory: (cursor?: string, ticker?: string, limit?: number) => Promise<PaginatedResponse<Dividend> | null> = async (cursor, ticker, limit = 20) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  if (ticker) params.set("ticker", ticker);
  return (await fetchResource(`equity/history/dividends?${params.toString()}`))
}

export const fetchTransactionHistory: (cursor?: string, limit?: number) => Promise<PaginatedResponse<Transaction> | null> = async (cursor, limit = 20) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  return (await fetchResource(`equity/history/transactions?${params.toString()}`))
}

export const fetchExports: () => Promise<Export[] | null> = async () => {
  return (await fetchResource("equity/history/exports"))
}