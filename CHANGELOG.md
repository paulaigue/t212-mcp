# Changelog

## 2.0.0 (2026-03-30)

### Breaking Changes

- **Account tools replaced**: `fetch-account-cash` and `fetch-account-metadata` replaced by `fetch-account-summary` using the new `/equity/account/summary` endpoint
- **Position endpoints migrated**: Now uses `/equity/positions` instead of legacy `/equity/portfolio` — richer data including instrument details and wallet impact breakdown
- **Authentication**: Requires both `T212_API_KEY` and `T212_API_SECRET` (HTTP Basic Auth). The old single API key header is no longer supported by Trading 212
- **Minimum Node.js version**: Now requires Node.js 18+ (was 16+)

### New Tools

- `search-instruments` — Search 16,000+ tradeable instruments by name, ticker, ISIN, with optional type filter
- `fetch-exchanges` — All exchanges with working schedules and next open/close times
- `fetch-order-history` — Historical filled orders with pagination and ticker filter
- `fetch-dividend-history` — Dividend payment history with pagination and ticker filter
- `fetch-transaction-history` — Deposit/withdrawal history with pagination
- `fetch-exports` — List CSV export reports with download links

### Improvements

- **Demo mode**: Set `T212_ENVIRONMENT=demo` to use paper trading
- **Rate limit handling**: 429 errors now surface a clear message with reset time
- **Request timeout**: 30s timeout prevents hanging requests
- **Dependabot**: Automated weekly dependency update PRs
- All endpoints aligned with [official Trading 212 API docs](https://docs.trading212.com/api)

### Fixes

- Fix authentication (HTTP Basic Auth with key + secret)
- Fix server name typo (`t212-mpc` → `t212-mcp`)
- Fix Pie model literal types (`0`, `0.5` → `number`)
- Fix error message typo ("Could not given fetch" → "Could not fetch")
- Fix `==` to `===` comparisons
- Fix `console.log` → `console.error` for MCP compatibility
- URL-encode ticker parameter to prevent path injection
- Fix exports endpoint path to match official docs

### Deprecated

- `fetch-all-pies` — Pies API is deprecated by Trading 212

### Dependencies

- `@modelcontextprotocol/sdk` 1.8.0 → 1.28.0 (fixes 2 high severity vulnerabilities)
- `dotenv` 16.4.7 → 17.3.1
- `typescript` 5.8.2 → 6.0.2
- `@types/node` 22.13.14 → 25.5.0

## 1.0.0 (2025-06-10)

Initial release with 5 read-only tools: positions, pies, account cash, and account metadata.
