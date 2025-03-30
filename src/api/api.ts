
import type {Position} from "./models.ts"

const API_BASE = "https://live.trading212.com/api/v0"
const API_KEY = ""

const USER_AGENT = "T212-mcp/1.0"

async function fetchResource<T>(resourcePath: string): Promise<T | null> {
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
    console.log(`Error whle fetching ${resourcePath}: ${error}`)
    return null
  }
}

export const fetchOpenPositions: () => Promise<[Position] | null> = async () => {
  return (await fetchResource("equity/portfolio"))
}

export const fetchPosition: (ticker: string) => Promise<Position | null> = async (ticker) => {
  return (await fetchResource(`equity/portfolio/${ticker}`))
}