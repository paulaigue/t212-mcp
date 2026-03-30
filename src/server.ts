import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { FetchOpenPositionsTool } from "./tools/FetchOpenPositionsTool.js"
import { FetchPositionTool } from "./tools/FetchPositionTool.js";
import { FetchAllPiesTool } from "./tools/FetchAllPiesTool.js";
import { FetchAccountCashTool } from "./tools/FetchAccountCashTool.js";
import { FetchAccountMetadataTool } from "./tools/FetchAccountMetadataTool.js";
import { SearchInstrumentsTool } from "./tools/SearchInstrumentsTool.js";
import { FetchExchangesTool } from "./tools/FetchExchangesTool.js";
import { FetchOrderHistoryTool } from "./tools/FetchOrderHistoryTool.js";
import { FetchDividendHistoryTool } from "./tools/FetchDividendHistoryTool.js";


export const SERVER_NAME = "t212-mcp"

export class T212Mcp {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: SERVER_NAME,
      version: "1.0.0",
    });

    this.server.tool(
      FetchOpenPositionsTool.name,
      FetchOpenPositionsTool.description,
      FetchOpenPositionsTool.callBack
    )
    
    this.server.tool(
      FetchPositionTool.name,
      FetchPositionTool.description,
      FetchPositionTool.args,
      FetchPositionTool.callBack
    )
    
    this.server.tool(
      FetchAllPiesTool.name,
      FetchAllPiesTool.description,
      FetchAllPiesTool.callBack
    )

    this.server.tool(
      FetchAccountCashTool.name,
      FetchAccountCashTool.description,
      FetchAccountCashTool.callBack
    )

    this.server.tool(
      FetchAccountMetadataTool.name,
      FetchAccountMetadataTool.description,
      FetchAccountMetadataTool.callBack
    )

    this.server.tool(
      SearchInstrumentsTool.name,
      SearchInstrumentsTool.description,
      SearchInstrumentsTool.args,
      SearchInstrumentsTool.callBack
    )

    this.server.tool(
      FetchExchangesTool.name,
      FetchExchangesTool.description,
      FetchExchangesTool.callBack
    )

    this.server.tool(
      FetchOrderHistoryTool.name,
      FetchOrderHistoryTool.description,
      FetchOrderHistoryTool.args,
      FetchOrderHistoryTool.callBack
    )

    this.server.tool(
      FetchDividendHistoryTool.name,
      FetchDividendHistoryTool.description,
      FetchDividendHistoryTool.args,
      FetchDividendHistoryTool.callBack
    )
  }

  async connect() {
    const transport = new StdioServerTransport();
    
    await this.server.connect(transport);
    console.error("T212 MCP Server running on stdio");
  }

}

