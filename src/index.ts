#!/usr/bin/env node
import 'dotenv/config'

import { T212Mcp } from "./server.js"

async function main() {
  const t212Mcp = new T212Mcp()
  await t212Mcp.connect()
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});