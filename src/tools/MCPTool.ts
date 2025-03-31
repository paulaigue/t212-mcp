import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"
import {ZodRawShape } from "zod"

export interface MCPTool<T extends ZodRawShape | undefined = undefined> {
  name: string,
  description: string,
  args: T,
  callBack: ToolCallback<T extends ZodRawShape ? T : undefined>,
}