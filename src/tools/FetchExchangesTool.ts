import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool, mapToolResponse } from "./MCPTool.js";
import type { Exchange } from "../models/Exchange.js"
import { fetchExchanges } from "../api/api.js"

const callback: ToolCallback = async () => {
  const exchanges: Exchange[] | null = await fetchExchanges();

  if (exchanges !== null) {
    const content = exchanges.map(exchange => {
      const schedules = exchange.workingSchedules.map(s => {
        const events = s.timeEvents;
        const nextOpen = events.find(e => e.type === "OPEN" && new Date(e.date) > new Date());
        const nextClose = events.find(e => e.type === "CLOSE" && new Date(e.date) > new Date());
        return {
          scheduleId: s.id,
          totalEvents: events.length,
          nextOpen: nextOpen?.date ?? "N/A",
          nextClose: nextClose?.date ?? "N/A",
        };
      });

      return {
        type: "text" as const,
        text: `${exchange.name} (id: ${exchange.id})\n` +
          schedules.map(s =>
            `  Schedule ${s.scheduleId}: next open ${s.nextOpen}, next close ${s.nextClose}`
          ).join("\n")
      };
    });

    return { content }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch exchanges"
      }
    ]
  }
}

export const FetchExchangesTool: MCPTool = {
  name: "fetch-exchanges",
  description: "Fetch all available exchanges and their working schedules, including next open/close times",
  args: undefined,
  callBack: callback
}
