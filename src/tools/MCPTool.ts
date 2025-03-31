import {ToolCallback} from "@modelcontextprotocol/sdk/server/mcp.js"
import {object, ZodRawShape } from "zod"

export interface MCPTool<T extends ZodRawShape | undefined = undefined> {
  name: string,
  description: string,
  args: T,
  callBack: ToolCallback<T extends ZodRawShape ? T : undefined>,
}

const formatValue = (value: any, indent: string = '', depth: number = 0): string => {
  if (value === null) return 'null';
  if (typeof value !== 'object' || depth > 5) return String(value);
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return '[\n' + value.map(v => `${indent}  ${formatValue(v, indent + '  ', depth + 1)}`).join(',\n') + `\n${indent}]`;
  }
  
  const entries = Object.entries(value);
  if (entries.length === 0) return '{}';
  return '{\n' + entries
    .map(([k, v]) => `${indent}  ${k}: ${formatValue(v, indent + '  ', depth + 1)}`)
    .join(',\n') + `\n${indent}}`;
}

export const mapToolResponse = (record: Record<string, any>) => {
  return [{
    type: "text" as const,
    text: Object.entries(record)
      .map(([key, value]) => `${key}: ${formatValue(value)}`)
      .join("\n")
  }]
}