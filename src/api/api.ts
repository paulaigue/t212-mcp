import type {Position} from "../models/Position.js"
import type {Pie} from "../models/Pie.js"
import type {AccountCash, AccountMetadata} from "../models/Account.js"

const API_BASE = "https://live.trading212.com/api/v0"
const API_KEY = process.env.T212_API_KEY ?? ""

const USER_AGENT = "T212-mcp/1.0"

async function fetchResource<T>(resourcePath: string): Promise<T | null> {
  if (API_KEY.length == 0) {
    throw Error("No API key found")
  }

  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
    Authorization: API_KEY
  };

  try {
    const response = await fetch(`${API_BASE}/${resourcePath}`, {headers})

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json() as T);
  } catch (error) {
    console.log(`Error while fetching ${resourcePath}: ${error}`)
    return null
  }
}

export const fetchOpenPositions: () => Promise<[Position] | null> = async () => {
  return (await fetchResource("equity/portfolio"))
}

export const fetchPosition: (ticker: string) => Promise<Position | null> = async (ticker) => {
  return (await fetchResource(`equity/portfolio/${ticker}`))
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