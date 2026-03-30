import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool } from "./MCPTool.js";
import type { Position } from "../models/Position.js"
import { fetchPositions } from "../api/api.js"

type ArgsType = { ticker: z.ZodString }

const args: ArgsType = {
  ticker: z.string().describe("Instrument ticker (e.g. AAPL_US_EQ)")
}

const callback: ToolCallback<ArgsType> = async ({ ticker }) => {
  const positions: Position[] | null = await fetchPositions(ticker);

  if (positions !== null && positions.length > 0) {
    const p = positions[0];
    const pnl = p.walletImpact.unrealizedProfitLoss;
    const pnlSign = pnl >= 0 ? "+" : "";

    return {
      content: [{
        type: "text" as const,
        text: [
          `${p.instrument.name} (${p.instrument.ticker})`,
          `  ISIN: ${p.instrument.isin}`,
          `  Instrument currency: ${p.instrument.currency}`,
          `  Quantity: ${p.quantity} @ avg ${p.averagePricePaid} ${p.instrument.currency}`,
          `  Current price: ${p.currentPrice} ${p.instrument.currency}`,
          `  Value: ${p.walletImpact.currentValue} ${p.walletImpact.currency} (cost: ${p.walletImpact.totalCost})`,
          `  P/L: ${pnlSign}${pnl} ${p.walletImpact.currency}${p.walletImpact.fxImpact != null ? ` (FX impact: ${p.walletImpact.fxImpact})` : ""}`,
          `  In pies: ${p.quantityInPies} | Available: ${p.quantityAvailableForTrading}`,
          `  Opened: ${p.createdAt}`,
        ].join("\n")
      }]
    }
  }

  return {
    content: [{ type: "text", text: "Could not fetch position" }]
  }
}

export const FetchPositionTool: MCPTool<ArgsType> = {
  name: "fetch-position",
  description: "Fetch a specific open position by ticker",
  args: args,
  callBack: callback
}
