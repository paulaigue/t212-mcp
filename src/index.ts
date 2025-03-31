import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import 'dotenv/config'

import { runDebug } from "./debug.js"
import { T212Mcp } from "./server.js"

async function main() {

  const isDebug = process.argv.find(arg => arg == "run_debug")
  if (isDebug) {
    console.log("Running DEBUG")
    runDebug()
  } else {
    await initAndStartServer()
  }
}

async function initAndStartServer() {
  const transport = new StdioServerTransport();
  const t212Mcp = new T212Mcp()
  
  await t212Mcp.server.connect(transport);
  console.error("T212 MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});