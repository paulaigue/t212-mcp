import { describe, it, expect, vi, beforeEach } from "vitest"
import { logger } from "../logger.js"

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("outputs to stderr", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.info("test message")
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain("INFO: test message")
  })

  it("includes timestamp in ISO format", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.info("timestamp check")
    const output: string = spy.mock.calls[0][0]
    const match = output.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)\]/)
    expect(match).not.toBeNull()
  })

  it("includes context as JSON", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.warn("with context", { resource: "equity/portfolio", attempt: 2 })
    const output: string = spy.mock.calls[0][0]
    expect(output).toContain("WARN: with context")
    expect(output).toContain('"resource":"equity/portfolio"')
    expect(output).toContain('"attempt":2')
  })

  it("redacts sensitive keys in context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.error("sensitive", {
      authorization: "Bearer sk-secret-123",
      apiKey: "key-456",
      token: "tok-789",
      secret: "my-secret",
      password: "hunter2",
      resource: "equity/portfolio",
    })
    const output: string = spy.mock.calls[0][0]
    expect(output).not.toContain("sk-secret-123")
    expect(output).not.toContain("key-456")
    expect(output).not.toContain("tok-789")
    expect(output).not.toContain("my-secret")
    expect(output).not.toContain("hunter2")
    expect(output).toContain("[REDACTED]")
    expect(output).toContain("equity/portfolio")
  })

  it("handles missing context gracefully", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.info("no context")
    const output: string = spy.mock.calls[0][0]
    expect(output).toContain("INFO: no context")
    expect(output).not.toContain("{}")
  })

  it("does not output DEBUG messages (default level is INFO)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.debug("should be hidden")
    expect(spy).not.toHaveBeenCalled()
  })

  it("outputs ERROR messages", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.error("critical failure")
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain("ERROR: critical failure")
  })
})
