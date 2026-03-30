import type {Position} from "../models/Position.js"
import type {Pie} from "../models/Pie.js"
import type {AccountCash, AccountMetadata} from "../models/Account.js"
import type {Instrument} from "../models/Instrument.js"
import type {Exchange} from "../models/Exchange.js"
import type {HistoricalOrder, PaginatedResponse} from "../models/HistoricalOrder.js"
import type {Dividend} from "../models/Dividend.js"
import type {Transaction} from "../models/Transaction.js"
import type {Export} from "../models/Export.js"

const API_BASE = "https://live.trading212.com/api/v0"
const API_KEY = process.env.T212_API_KEY ?? ""
const API_SECRET = process.env.T212_API_SECRET ?? ""

const USER_AGENT = "T212-mcp/1.0"

async function fetchResource<T>(resourcePath: string): Promise<T | null> {
  if (API_KEY.length === 0) {
    throw Error("No API key found. Set T212_API_KEY environment variable.")
  }
  if (API_SECRET.length === 0) {
    throw Error("No API secret found. Set T212_API_SECRET environment variable.")
  }

  const credentials = btoa(`${API_KEY}:${API_SECRET}`)
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
    Authorization: `Basic ${credentials}`
  };

  try {
    const response = await fetch(`${API_BASE}/${resourcePath}`, {headers})

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json() as T);
  } catch (error) {
    console.error(`Error while fetching ${resourcePath}: ${error}`)
    return null
  }
}

export const fetchOpenPositions: () => Promise<[Position] | null> = async () => {
  return (await fetchResource("equity/portfolio"))
}

export const fetchPosition: (ticker: string) => Promise<Position | null> = async (ticker) => {
  return (await fetchResource(`equity/portfolio/${encodeURIComponent(ticker)}`))
}

export const fetchAllPies: () => Promise<[Pie] | null> = async () => {
  return (await fetchResource("equity/pies"))
}

export const fetchAccountCash: () => Promise<AccountCash | null> = async () => {
  return (await fetchResource("equity/account/cash"))
}

export const fetchAccountMetadata: () => Promise<AccountMetadata | null> = async () => {
  return (await fetchResource("equity/account/info"))
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
  return (await fetchResource("history/exports"))
}