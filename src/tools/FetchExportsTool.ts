import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js"

import { MCPTool } from "./MCPTool.js";
import { fetchExports } from "../api/api.js"

const callback: ToolCallback = async () => {
  const exports = await fetchExports();

  if (exports !== null) {
    const content = exports.map(exp => {
      const included = Object.entries(exp.dataIncluded)
        .filter(([_, v]) => v)
        .map(([k]) => k.replace("include", ""))
        .join(", ");

      return {
        type: "text" as const,
        text: [
          `Report ${exp.reportId} — ${exp.status}`,
          `  Period: ${exp.timeFrom} to ${exp.timeTo}`,
          `  Includes: ${included}`,
          exp.downloadLink ? `  Download: ${exp.downloadLink}` : `  Download: not available`,
        ].join("\n")
      };
    });

    const header = {
      type: "text" as const,
      text: `${exports.length} CSV export reports found`
    };

    return { content: [header, ...content] }
  }

  return {
    content: [{ type: "text", text: "Could not fetch exports" }]
  }
}

export const FetchExportsTool: MCPTool = {
  name: "fetch-exports",
  description: "List all CSV account export reports with their status and download links",
  args: undefined,
  callBack: callback
}
