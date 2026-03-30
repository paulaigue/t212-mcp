import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool } from "./MCPTool.js";
import type { Position } from "../models/Position.js"
import { fetchPositions } from "../api/api.js"

function formatPosition(p: Position): string {
  const pnl = p.walletImpact.unrealizedProfitLoss;
  const pnlSign = pnl >= 0 ? "+" : "";
  return [
    `${p.instrument.name} (${p.instrument.ticker})`,
    `  Quantity: ${p.quantity} @ avg ${p.averagePricePaid} ${p.instrument.currency}`,
    `  Current price: ${p.currentPrice} ${p.instrument.currency}`,
    `  Value: ${p.walletImpact.currentValue} ${p.walletImpact.currency} (cost: ${p.walletImpact.totalCost})`,
    `  P/L: ${pnlSign}${pnl} ${p.walletImpact.currency}${p.walletImpact.fxImpact != null ? ` (FX impact: ${p.walletImpact.fxImpact})` : ""}`,
    `  In pies: ${p.quantityInPies} | Available: ${p.quantityAvailableForTrading}`,
    `  Opened: ${p.createdAt}`,
  ].join("\n");
}

const callback: ToolCallback = async () => {
  const positions: Position[] | null = await fetchPositions();

  if (positions !== null) {
    const content = positions.map(p => ({
      type: "text" as const,
      text: formatPosition(p),
    }));

    const header = {
      type: "text" as const,
      text: `${positions.length} open positions`
    };

    return { content: [header, ...content] }
  }

  return {
    content: [{ type: "text", text: "Could not fetch positions" }]
  }
}

export const FetchOpenPositionsTool: MCPTool = {
  name: "fetch-open-positions",
  description: "Fetch all open investment positions with current price, P/L, and wallet impact",
  args: undefined,
  callBack: callback
}
