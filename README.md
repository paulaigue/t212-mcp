# T212 MCP Server

A Model Context Protocol (MCP) server for interacting with Trading212's API. This server provides a standardized interface for AI models to access Trading212 account information and perform trading operations.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI models to interact with external tools and services. It provides a secure and controlled environment where AI can access specific functionalities while maintaining proper boundaries and security measures.

See documentation here: https://modelcontextprotocol.io

## Features

- Portfolio position (read only for now)
- Pies (automated investment portfolios) management (read only for now)
- Account cash and metadata retrieval

## Prerequisites

- Node.js (v16 or higher)
- A Trading212 API key
- MCP-compatible client (like Claude)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/paulaigue/t212-mcp.git
cd t212-mpc
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

To use this MCP server, you need to configure it in your MCP client settings. Here's an example configuration for Claude:

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

## Available Tools

The server provides the following functionality:

- `fetchOpenPositions`: Get all open positions in your portfolio
- `fetchPosition`: Get details for a specific position by ticker
- `fetchAllPies`: Retrieve all your investment pies
- `fetchAccountCash`: Get your account's cash information
- `fetchAccountMetadata`: Get your account's metadata

## Security Notes

- Never commit your Trading212 API key to version control
- Keep your MCP configuration file secure
- Regularly rotate your API keys

## License

This project is licensed under the MIT License.
