import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool, mapToolResponse } from "./MCPTool.js";
import type {Position} from "../models/Position.js"
import { fetchPosition } from "../api/api.js"

type ArgsType = {ticker: z.ZodString}

const args: ArgsType = {
  ticker: z.string()
    .min(1, "Ticker must not be empty")
    .max(20, "Ticker must not exceed 20 characters")
    .regex(/^[A-Za-z0-9._-]+$/, "Ticker contains invalid characters")
}

const callback: ToolCallback<ArgsType> = async ({ticker}) => {
  const position: Position | null = await fetchPosition(ticker);

  if (position !== null) {
    const positionsContent = mapToolResponse(position);

    return {
      content: positionsContent,
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch position"
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
