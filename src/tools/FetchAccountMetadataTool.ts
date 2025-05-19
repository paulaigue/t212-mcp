import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool, mapToolResponse } from "./MCPTool.js";
import type {AccountMetadata} from "../models/Account.js"
import { fetchAccountMetadata } from "../api/api.js"

const callback: ToolCallback = async () => {
  const accountMetadata: AccountMetadata | null = await fetchAccountMetadata();

  if (accountMetadata !== null) {
    const metadataContent = mapToolResponse(accountMetadata);
  
    return {
      content: metadataContent,
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch account metadata"
      }
    ]
  }
}

export const FetchAccountMetadataTool: MCPTool = {
  name: "fetch-account-metadata",
  description: "Fetch my Trading212 account metadata including account ID, name, currency, and type",
  args: undefined,
  callBack: callback
} 