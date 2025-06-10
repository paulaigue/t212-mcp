# T212 MCP Server

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

## Installation

### Via npm (recommended)

```bash
npm install -g t212-mcp-server
```

### From source

```bash
git clone https://github.com/paulaigue/t212-mcp.git
cd t212-mcp
npm install
npm run build
```

## Prerequisites

- Node.js (v16 or higher)
- A Trading212 API key
- MCP-compatible client (like Claude)

## Configuration

To use this MCP server, you need to configure it in your MCP client settings. Here's an example configuration for Claude:

### For npm installation:

```json
{
  "mcpServers": {
    "t212-mcp": {      
      "command": "t212-mcp",
      "env": {
        "T212_API_KEY": "your-trading212-api-key"
      }
    }
  }
}
```

### For local installation:

```json
{
  "mcpServers": {
    "t212-mcp": {      
      "command": "node",
      "args": [
        "/path/to/your/build/index.js"
      ],
      "env": {
        "T212_API_KEY": "your-trading212-api-key"
      }
    }
  }
}
```

## Getting your Trading212 API Key

1. Log into your Trading212 account
2. Navigate to Settings → API (Practice or Live)
3. Generate a new API key
4. Copy the key and use it in your configuration

## Available Tools

The server provides the following functionality:

- `fetchOpenPositions`: Get all open positions in your portfolio
- `fetchPosition`: Get details for a specific position by ticker
- `fetchAllPies`: Retrieve all your investment pies
- `fetchAccountCash`: Get your account's cash information
- `fetchAccountMetadata`: Get your account's metadata

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