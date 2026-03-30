import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { MCPTool, mapToolResponse } from "./MCPTool.js";
import type { Instrument } from "../models/Instrument.js"
import { fetchInstruments } from "../api/api.js"

type ArgsType = {
  query: z.ZodString,
  type: z.ZodOptional<z.ZodString>,
}

const args: ArgsType = {
  query: z.string().describe("Search term to filter instruments by ticker or name (case-insensitive)"),
  type: z.string().optional().describe("Filter by instrument type (e.g. STOCK, ETF, WARRANT, CRYPTO, INDEX, FOREX, FUTURES, CVR, CORPACT)"),
}

const MAX_RESULTS = 50

const callback: ToolCallback<ArgsType> = async ({ query, type }) => {
  const instruments: Instrument[] | null = await fetchInstruments();

  if (instruments !== null) {
    const search = query.toLowerCase();
    let filtered = instruments.filter(i =>
      i.ticker.toLowerCase().includes(search) ||
      i.name.toLowerCase().includes(search) ||
      i.shortName.toLowerCase().includes(search) ||
      i.isin.toLowerCase().includes(search)
    );

    if (type) {
      filtered = filtered.filter(i => i.type === type);
    }

    const results = filtered.slice(0, MAX_RESULTS);
    const content = results.flatMap(mapToolResponse);

    const header = {
      type: "text" as const,
      text: `Found ${filtered.length} instruments matching "${query}"${type ? ` (type: ${type})` : ""}${filtered.length > MAX_RESULTS ? ` — showing first ${MAX_RESULTS}` : ""}`
    };

    return {
      content: [header, ...content],
    }
  }

  return {
    content: [
      {
        type: "text",
        text: "Could not fetch instruments"
      }
    ]
  }
}

export const SearchInstrumentsTool: MCPTool<ArgsType> = {
  name: "search-instruments",
  description: "Search for tradeable instruments (stocks, ETFs, warrants) by name, ticker, or ISIN. Returns up to 50 matching results.",
  args: args,
  callBack: callback
}
