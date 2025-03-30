import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool } from "./MCPTool.js";
import type {Position} from "../api/models.js"
import {mapPosition} from "../api/models.js"
import { fetchPosition } from "../api/api.js"

type ArgsType = {ticker: z.ZodString}

const args: ArgsType = {
  ticker: z.string()
}

const callback: ToolCallback<ArgsType> = async ({ticker}, extra) => {
  const position: Position | null = await fetchPosition(ticker);

  if (position !== null) {
    const positionsContent = mapPosition(position);
  
    return {
      content: positionsContent,
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not given fetch position"
      }
    ]
  }

}

export const FetchPositionTool: MCPTool<ArgsType> = {
  name: "fetch-position",
  description: "Fetch a specific investment position",
  args: args,
  callBack: callback
}