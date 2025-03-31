import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool } from "./MCPTool.js";
import type {Pie} from "../models/Pie.js"
import {mapPie} from "../models/Pie.js"
import { fetchAllPies } from "../api/api.js"

const callback: ToolCallback = async () => {
  const pies: Pie[] | null = await fetchAllPies();

  if (pies !== null) {
    const positionsContent = pies.flatMap(mapPie);
  
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
  description: "Fetch all my pies. A pie is a collection of securities - stocks & ETFs. Each security is represented as a slice of the pie. Each pie can hold up to 50 securities. You can have multiple pies.",
  args: undefined,
  callBack: callback
}