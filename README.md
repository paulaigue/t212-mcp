# T212 MCP Server

[![npm version](https://badge.fury.io/js/t212-mcp-server.svg)](https://badge.fury.io/js/t212-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for interacting with Trading212's API. This server provides a standardized interface for AI models to access Trading212 account information and perform trading operations.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI models to interact with external tools and services. It provides a secure and controlled environment where AI can access specific functionalities while maintaining proper boundaries and security measures.

See documentation here: https://modelcontextprotocol.io

## Features

- 📊 Portfolio position retrieval (read-only)
- 🥧 Pies (automated investment portfolios) management (read-only)
- 💰 Account cash and metadata retrieval
- 🔒 Secure API key authentication
- 🤖 Compatible with Claude and other MCP clients

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- A Trading212 API key ([get yours here](#getting-your-trading212-api-key))
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
        "T212_API_KEY": "your-trading212-api-key"
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
        "T212_API_KEY": "your-trading212-api-key"
      }
    }
  }
}
```

### How to access the config file:
1. Open Claude Desktop Settings
2. Go to the **Developer** tab
3. Click **"Edit Config"**
4. Add your configuration and save
5. Restart Claude Desktop

For detailed configuration instructions, see the [official MCP documentation](https://modelcontextprotocol.io/quickstart/user).

## Getting your Trading212 API Key

1. Log into your Trading212 account
2. Navigate to Settings → API 
3. Generate a new API key
4. Copy the key and use it in your configuration

## Available Tools

The server provides the following functionality:

- `fetchOpenPositions`: Get all open positions in your portfolio
- `fetchPosition`: Get details for a specific position by ticker
- `fetchAllPies`: Retrieve all your investment pies
- `fetchAccountCash`: Get your account's cash information
- `fetchAccountMetadata`: Get your account's metadata

After configuring, restart Claude Desktop and you should see the T212 tools available.

## Security Notes

- ⚠️ Never commit your Trading212 API key to version control
- 🔒 Keep your MCP configuration file secure
- 🔄 Regularly rotate your API keys
- 📝 This server currently provides read-only access to your Trading212 account

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [issues page](https://github.com/paulaigue/t212-mcp/issues)
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible, including error messages and your configuration