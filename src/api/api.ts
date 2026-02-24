import { z } from "zod"
import type { Position } from "../models/Position.js"
import type { Pie } from "../models/Pie.js"
import type { AccountCash, AccountMetadata } from "../models/Account.js"
import {
  PositionSchema, PositionArraySchema,
  PieArraySchema,
  AccountCashSchema, AccountMetadataSchema
} from "../models/schemas.js"
import { logger } from "../logger.js"

const API_BASE = "https://live.trading212.com/api/v0"
const API_KEY = process.env.T212_API_KEY ?? ""

const USER_AGENT = "T212-mcp/1.0"

const REQUEST_TIMEOUT_MS = 30_000
const MIN_REQUEST_INTERVAL_MS = 200
const MAX_RESPONSE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 1_000

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504])

let lastRequestTime = 0

async function throttle(): Promise<void> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed))
  }
  lastRequestTime = Date.now()
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchWithTimeout(url: string, headers: Record<string, string>): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, { headers, signal: controller.signal })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

async function readResponseBody(response: Response): Promise<string> {
  const contentLength = response.headers.get("content-length")
  if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE_BYTES) {
    throw new ApiError(`Response too large: ${contentLength} bytes (limit: ${MAX_RESPONSE_SIZE_BYTES})`)
  }

  const text = await response.text()
  if (text.length > MAX_RESPONSE_SIZE_BYTES) {
    throw new ApiError(`Response body too large: ${text.length} bytes (limit: ${MAX_RESPONSE_SIZE_BYTES})`)
  }

  return text
}

function classifyHttpError(status: number): ApiError {
  const retryable = RETRYABLE_STATUS_CODES.has(status)

  switch (status) {
    case 401:
      return new ApiError("Authentication failed. Check your T212_API_KEY.", status, false)
    case 403:
      return new ApiError("Access forbidden. Your API key may lack the required permissions.", status, false)
    case 404:
      return new ApiError("Resource not found.", status, false)
    case 429:
      return new ApiError("Rate limited by Trading212 API. Try again later.", status, true)
    default:
      return new ApiError(`HTTP error ${status}`, status, retryable)
  }
}

async function fetchResource<T>(resourcePath: string, schema: z.ZodType<T>): Promise<T | null> {
  if (API_KEY.length === 0) {
    throw new ApiError("No API key found. Set the T212_API_KEY environment variable.")
  }

  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
    Authorization: API_KEY,
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1)
      logger.warn("Retrying request", { attempt, delay, resource: resourcePath })
      await sleep(delay)
    }

    await throttle()

    try {
      const response = await fetchWithTimeout(`${API_BASE}/${resourcePath}`, headers)

      if (!response.ok) {
        const error = classifyHttpError(response.status)
        if (!error.retryable) {
          logger.error("Non-retryable API error", { status: response.status, resource: resourcePath })
          return null
        }
        lastError = error
        continue
      }

      const body = await readResponseBody(response)
      const json: unknown = JSON.parse(body)

      const parsed = schema.safeParse(json)
      if (!parsed.success) {
        logger.error("API response validation failed", {
          resource: resourcePath,
          errors: parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`),
        })
        return null
      }

      return parsed.data
    } catch (error) {
      if (error instanceof ApiError) {
        lastError = error
        if (!error.retryable) {
          logger.error(error.message, { resource: resourcePath })
          return null
        }
        continue
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        logger.error("Request timed out", { resource: resourcePath, timeoutMs: REQUEST_TIMEOUT_MS })
        lastError = new ApiError("Request timed out", undefined, true)
        continue
      }

      if (error instanceof SyntaxError) {
        logger.error("Failed to parse API response as JSON", { resource: resourcePath })
        return null
      }

      logger.error("Unexpected error during fetch", {
        resource: resourcePath,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return null
    }
  }

  logger.error("All retry attempts exhausted", {
    resource: resourcePath,
    lastError: lastError?.message,
  })
  return null
}

export async function fetchOpenPositions(): Promise<Position[] | null> {
  return fetchResource("equity/portfolio", PositionArraySchema)
}

export async function fetchPosition(ticker: string): Promise<Position | null> {
  const encoded = encodeURIComponent(ticker)
  return fetchResource(`equity/portfolio/${encoded}`, PositionSchema)
}

export async function fetchAllPies(): Promise<Pie[] | null> {
  return fetchResource("equity/pies", PieArraySchema)
}

export async function fetchAccountCash(): Promise<AccountCash | null> {
  return fetchResource("equity/account/cash", AccountCashSchema)
}

export async function fetchAccountMetadata(): Promise<AccountMetadata | null> {
  return fetchResource("equity/account/info", AccountMetadataSchema)
}
