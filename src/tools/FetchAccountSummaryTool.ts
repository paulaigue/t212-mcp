import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool } from "./MCPTool.js";
import { fetchAccountSummary } from "../api/api.js"

const callback: ToolCallback = async () => {
  const summary = await fetchAccountSummary();

  if (summary !== null) {
    return {
      content: [{
        type: "text" as const,
        text: [
          `Account #${summary.id} (${summary.currency})`,
          `Total value: ${summary.totalValue} ${summary.currency}`,
          ``,
          `Cash:`,
          `  Available to trade: ${summary.cash.availableToTrade}`,
          `  Reserved for orders: ${summary.cash.reservedForOrders}`,
          `  In pies: ${summary.cash.inPies}`,
          ``,
          `Investments:`,
          `  Current value: ${summary.investments.currentValue}`,
          `  Total cost: ${summary.investments.totalCost}`,
          `  Unrealized P/L: ${summary.investments.unrealizedProfitLoss}`,
          `  Realized P/L: ${summary.investments.realizedProfitLoss}`,
        ].join("\n")
      }]
    }
  }

  return {
    content: [{ type: "text", text: "Could not fetch account summary" }]
  }
}

export const FetchAccountSummaryTool: MCPTool = {
  name: "fetch-account-summary",
  description: "Fetch Trading212 account summary including cash balance, investment value, and profit/loss",
  args: undefined,
  callBack: callback
}
