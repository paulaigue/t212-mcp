import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool } from "./MCPTool.js";
import { fetchOrderHistory } from "../api/api.js"

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
  const result = await fetchOrderHistory(cursor, ticker, clampedLimit);

  if (result !== null) {
    const content = result.items.map(item => {
      const o = item.order;
      const f = item.fill;
      return {
        type: "text" as const,
        text: [
          `${o.side} ${o.ticker} — ${o.instrument.name}`,
          `  Status: ${o.status} | Type: ${o.type} | Strategy: ${o.strategy}`,
          `  Value: ${o.filledValue} ${o.currency} | Quantity: ${f.quantity} @ ${f.price}`,
          `  Initiated from: ${o.initiatedFrom}`,
          `  Created: ${o.createdAt} | Filled: ${f.filledAt}`,
        ].join("\n")
      };
    });

    const header = {
      type: "text" as const,
      text: `Order history: ${result.items.length} orders returned${result.nextPagePath ? "\nMore results available — use cursor from nextPagePath" : ""}\nnextPagePath: ${result.nextPagePath ?? "none"}`
    };

    return { content: [header, ...content] }
  }

  return {
    content: [{ type: "text", text: "Could not fetch order history" }]
  }
}

export const FetchOrderHistoryTool: MCPTool<ArgsType> = {
  name: "fetch-order-history",
  description: "Fetch historical order data with optional pagination and ticker filter. Returns filled orders with price, quantity, and timing details.",
  args: args,
  callBack: callback
}
