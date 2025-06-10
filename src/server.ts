import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { FetchOpenPositionsTool } from "./tools/FetchOpenPositionsTool.js"
import { FetchPositionTool } from "./tools/FetchPositionTool.js";
import { FetchAllPiesTool } from "./tools/FetchAllPiesTool.js";
import { FetchAccountCashTool } from "./tools/FetchAccountCashTool.js";
import { FetchAccountMetadataTool } from "./tools/FetchAccountMetadataTool.js";


export const SERVER_NAME = "t212-mpc"

export class T212Mcp {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: SERVER_NAME,
      version: "1.0.0",
      capabilities: {
        resources: {},
        tools: {},
      },
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
  }

  async connect() {
    const transport = new StdioServerTransport();
    
    await this.server.connect(transport);
    console.error("T212 MCP Server running on stdio");
  }

}

