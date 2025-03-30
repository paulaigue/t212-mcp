import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"
import {ZodRawShape } from "zod"


export interface MCPTool<T extends undefined | ZodRawShape> {
  name: string,
  description: string,
  args: ZodRawShape | undefined,
  callBack: ToolCallback<T>,
}