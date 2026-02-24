#!/usr/bin/env node
import 'dotenv/config'

import { T212Mcp } from "./server.js"
import { logger } from "./logger.js"

async function main() {
  const t212Mcp = new T212Mcp()
  await t212Mcp.connect()
}

main().catch((error) => {
  logger.error("Fatal error in main()", { error: error instanceof Error ? error.message : String(error) })
  process.exit(1);
});