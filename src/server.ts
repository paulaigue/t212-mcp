import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { FetchOpenPositionsTool } from "./tools/FetchOpenPositionsTool.js"


export const SERVER_NAME = "t212-mpc"

export class T212Mcp {
  public readonly server: McpServer;

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
  }

}

