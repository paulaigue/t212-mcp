import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool } from "./MCPTool.js";
import type {Position} from "../api/models.js"
import {mapPosition} from "../api/models.js"
import { fetchOpenPositions } from "../api/api.js"

const callback: ToolCallback = async () => {
  const positions: Position[] | null = await fetchOpenPositions();

  if (positions !== null) {
    const positionsContent = positions.flatMap(mapPosition);
  
    return {
      content: positionsContent,
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch positions"
      }
    ]
  }

}

export const FetchOpenPositionsTool: MCPTool<undefined> = {
  name: "fetch-open-positions",
  description: "Fetch all my investents open positions",
  args: undefined,
  callBack: callback
}