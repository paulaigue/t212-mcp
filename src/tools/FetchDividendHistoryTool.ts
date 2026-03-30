import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool } from "./MCPTool.js";
import { fetchDividendHistory } from "../api/api.js"

type ArgsType = {
  cursor: z.ZodOptional<z.ZodString>,
  ticker: z.ZodOptional<z.ZodString>,
  limit: z.ZodOptional<z.ZodNumber>,
}

const args: ArgsType = {
  cursor: z.string().optional().describe("Pagination cursor from a previous response's nextPagePath"),
  ticker: z.string().optional().describe("Filter by instrument ticker (e.g. AAPL_US_EQ)"),
  limit: z.number().optional().describe("Number of results to return (default: 20, max: 50)"),
}

const callback: ToolCallback<ArgsType> = async ({ cursor, ticker, limit }) => {
  const clampedLimit = Math.min(Math.max(limit ?? 20, 1), 50);
  const result = await fetchDividendHistory(cursor, ticker, clampedLimit);

  if (result !== null) {
    const content = result.items.map(item => ({
      type: "text" as const,
      text: [
        `${item.instrument.name} (${item.ticker})`,
        `  Amount: ${item.amount} ${item.currency} (${item.grossAmountPerShare} per share)`,
        `  Quantity: ${item.quantity}`,
        `  Type: ${item.type}`,
        `  Paid on: ${item.paidOn}`,
      ].join("\n")
    }));

    const header = {
      type: "text" as const,
      text: `Dividend history: ${result.items.length} dividends returned${result.nextPagePath ? "\nMore results available — use cursor from nextPagePath" : ""}\nnextPagePath: ${result.nextPagePath ?? "none"}`
    };

    return { content: [header, ...content] }
  }

  return {
    content: [{ type: "text", text: "Could not fetch dividend history" }]
  }
}

export const FetchDividendHistoryTool: MCPTool<ArgsType> = {
  name: "fetch-dividend-history",
  description: "Fetch historical dividend payments with optional pagination and ticker filter. Returns dividend amount, quantity, and payment date.",
  args: args,
  callBack: callback
}
