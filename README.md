# T212 MCP Server

[![npm version](https://badge.fury.io/js/t212-mcp-server.svg)](https://badge.fury.io/js/t212-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for interacting with the [Trading 212 API](https://docs.trading212.com/api). Gives AI assistants read-only access to your Trading 212 account — positions, account summary, instruments, order history, dividends, and more.

## Features

- 📊 Portfolio positions with P/L and wallet impact
- 💰 Account summary (cash, investments, realized/unrealized P/L)
- 🔍 Instrument search (16,000+ stocks, ETFs, and more)
- 🏛️ Exchange schedules and working hours
- 📜 Order history, dividend history, and transaction history
- 📁 CSV export reports
- 🔒 Read-only — no trading operations
- 🧪 Demo mode for paper trading
- 🤖 Compatible with Claude, and other MCP clients

## Quick Start

### Prerequisites
- Node.js v18 or higher
- A Trading 212 API key and secret ([get yours here](#getting-your-trading-212-api-credentials))
- Claude Desktop or another MCP-compatible client

### Configuration for Claude Desktop

Add this to your Claude Desktop configuration file:

**Option 1: No installation required (recommended)**
```json
{
  "mcpServers": {
    "t212-mcp": {
      "command": "npx",
      "args": ["t212-mcp-server"],
      "env": {
        "T212_API_KEY": "your-api-key-id",
        "T212_API_SECRET": "your-api-secret"
      }
    }
  }
}
```

**Option 2: Global installation**
```bash
npm install -g t212-mcp-server
```
```json
{
  "mcpServers": {
    "t212-mcp": {
      "command": "t212-mcp-server",
      "env": {
        "T212_API_KEY": "your-api-key-id",
        "T212_API_SECRET": "your-api-secret"
      }
    }
  }
}
```

### Demo Mode

To use paper trading instead of your live account, add `T212_ENVIRONMENT`:

```json
{
  "env": {
    "T212_API_KEY": "your-demo-api-key-id",
    "T212_API_SECRET": "your-demo-api-secret",
    "T212_ENVIRONMENT": "demo"
  }
}
```

### How to access the Claude Desktop config file
1. Open Claude Desktop Settings
2. Go to the **Developer** tab
3. Click **"Edit Config"**
4. Add your configuration and save
5. Restart Claude Desktop

For detailed configuration instructions, see the [official MCP documentation](https://modelcontextprotocol.io/quickstart/user).

## Getting your Trading 212 API Credentials

1. Log into your Trading 212 account
2. Navigate to Settings → API
3. Generate a new API key
4. Copy both the **API Key ID** and the **Secret Key** (the secret is only shown at creation time)
5. Use both values in your configuration as `T212_API_KEY` and `T212_API_SECRET`

For more details, see the [Trading 212 Help Centre](https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key).

## Available Tools

| Tool | Description |
|------|-------------|
| `fetch-open-positions` | All open positions with current price, P/L, and wallet impact |
| `fetch-position` | A specific position by ticker |
| `fetch-account-summary` | Account cash balance, investment value, and P/L |
| `search-instruments` | Search 16,000+ instruments by name, ticker, or ISIN |
| `fetch-exchanges` | All exchanges with next open/close times |
| `fetch-order-history` | Historical filled orders (paginated) |
| `fetch-dividend-history` | Dividend payments (paginated) |
| `fetch-transaction-history` | Deposits and withdrawals (paginated) |
| `fetch-exports` | CSV export reports with download links |
| `fetch-all-pies` | Investment pies *(deprecated by Trading 212)* |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `T212_API_KEY` | Yes | Your Trading 212 API Key ID |
| `T212_API_SECRET` | Yes | Your Trading 212 API Secret |
| `T212_ENVIRONMENT` | No | `live` (default) or `demo` for paper trading |

## Security Notes

- ⚠️ Never commit your API credentials to version control
- 🔒 Keep your MCP configuration file secure
- 🔄 Regularly rotate your API keys
- 📝 This server provides read-only access only

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [issues page](https://github.com/paulaigue/t212-mcp/issues)
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible, including error messages and your configuration
