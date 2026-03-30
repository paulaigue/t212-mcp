import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool } from "./MCPTool.js";
import { fetchTransactionHistory } from "../api/api.js"

type ArgsType = {
  cursor: z.ZodOptional<z.ZodString>,
  limit: z.ZodOptional<z.ZodNumber>,
}

const args: ArgsType = {
  cursor: z.string().optional().describe("Pagination cursor from a previous response's nextPagePath"),
  limit: z.number().optional().describe("Number of results to return (default: 20, max: 50)"),
}

const callback: ToolCallback<ArgsType> = async ({ cursor, limit }) => {
  const clampedLimit = Math.min(Math.max(limit ?? 20, 1), 50);
  const result = await fetchTransactionHistory(cursor, clampedLimit);

  if (result !== null) {
    const content = result.items.map(item => ({
      type: "text" as const,
      text: `${item.type} ${item.amount} ${item.currency} — ${item.dateTime}`
    }));

    const header = {
      type: "text" as const,
      text: `Transaction history: ${result.items.length} transactions returned${result.nextPagePath ? "\nMore results available — use cursor from nextPagePath" : ""}\nnextPagePath: ${result.nextPagePath ?? "none"}`
    };

    return { content: [header, ...content] }
  }

  return {
    content: [{ type: "text", text: "Could not fetch transaction history" }]
  }
}

export const FetchTransactionHistoryTool: MCPTool<ArgsType> = {
  name: "fetch-transaction-history",
  description: "Fetch account transaction history (deposits, withdrawals) with optional pagination.",
  args: args,
  callBack: callback
}
