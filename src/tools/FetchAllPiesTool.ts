import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool, mapToolResponse } from "./MCPTool.js";
import type {Pie} from "../models/Pie.js"
import { fetchAllPies } from "../api/api.js"

const callback: ToolCallback = async () => {
  const pies: Pie[] | null = await fetchAllPies();

  if (pies !== null) {
    const positionsContent = pies.flatMap(mapToolResponse);
  
    return {
      content: positionsContent,
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch pies"
      }
    ]
  }

}

export const FetchAllPiesTool: MCPTool = {
  name: "fetch-all-pies",
  description: "[DEPRECATED] Fetch all pies. A pie is a collection of securities - stocks & ETFs. This endpoint is deprecated by Trading 212 and may be removed in the future.",
  args: undefined,
  callBack: callback
}