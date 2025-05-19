import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool, mapToolResponse } from "./MCPTool.js";
import type {AccountCash} from "../models/Account.js"
import { fetchAccountCash } from "../api/api.js"

const callback: ToolCallback = async () => {
  const accountCash: AccountCash | null = await fetchAccountCash();

  if (accountCash !== null) {
    const cashContent = mapToolResponse(accountCash);
  
    return {
      content: cashContent,
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch account cash information"
      }
    ]
  }
}

export const FetchAccountCashTool: MCPTool = {
  name: "fetch-account-cash",
  description: "Fetch my Trading212 account cash information including free cash, blocked cash, invested amount, PPL, and total cash",
  args: undefined,
  callBack: callback
} 