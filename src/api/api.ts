import type {Position} from "../models/Position.js"
import type {Pie} from "../models/Pie.js"
import type {AccountCash, AccountMetadata} from "../models/Account.js"

const API_BASE = "https://live.trading212.com/api/v0"
const API_KEY = process.env.T212_API_KEY ?? ""

const USER_AGENT = "T212-mcp/1.0"

const REQUEST_TIMEOUT_MS = 30_000
const MIN_REQUEST_INTERVAL_MS = 200

let lastRequestTime = 0

async function throttle(): Promise<void> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed))
  }
  lastRequestTime = Date.now()
}

async function fetchResource<T>(resourcePath: string): Promise<T | null> {
  if (API_KEY.length === 0) {
    throw new Error("No API key found. Set the T212_API_KEY environment variable.")
  }

  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
    Authorization: API_KEY
  };

  await throttle()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const response = await fetch(`${API_BASE}/${resourcePath}`, {
      headers,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json() as T);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(`Request timed out for resource: ${resourcePath}`)
    } else {
      console.error(`Error while fetching resource: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
    return null
  }
}

export const fetchOpenPositions: () => Promise<Position[] | null> = async () => {
  return (await fetchResource("equity/portfolio"))
}

export const fetchPosition: (ticker: string) => Promise<Position | null> = async (ticker) => {
  const encoded = encodeURIComponent(ticker)
  return (await fetchResource(`equity/portfolio/${encoded}`))
}

export const fetchAllPies: () => Promise<Pie[] | null> = async () => {
  return (await fetchResource("equity/pies"))
}

export const fetchAccountCash: () => Promise<AccountCash | null> = async () => {
  return (await fetchResource("equity/account/cash"))
}

export const fetchAccountMetadata: () => Promise<AccountMetadata | null> = async () => {
  return (await fetchResource("equity/account/info"))
}
