export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: Record<string, unknown>
}

const currentLevel: LogLevel = LogLevel.INFO

function formatEntry(entry: LogEntry): string {
  const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : ""
  return `[${entry.timestamp}] ${entry.level}: ${entry.message}${ctx}`
}

function log(level: LogLevel, levelName: string, message: string, context?: Record<string, unknown>) {
  if (level < currentLevel) return

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: levelName,
    message,
    context: sanitize(context),
  }

  console.error(formatEntry(entry))
}

function sanitize(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) return undefined
  const sanitized = { ...context }
  const sensitiveKeys = ["authorization", "apikey", "api_key", "token", "secret", "password"]
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]"
    }
  }
  return sanitized
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log(LogLevel.DEBUG, "DEBUG", message, context),
  info: (message: string, context?: Record<string, unknown>) => log(LogLevel.INFO, "INFO", message, context),
  warn: (message: string, context?: Record<string, unknown>) => log(LogLevel.WARN, "WARN", message, context),
  error: (message: string, context?: Record<string, unknown>) => log(LogLevel.ERROR, "ERROR", message, context),
}
