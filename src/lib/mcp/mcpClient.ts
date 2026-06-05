// ─── MCP Client – tool registry & session manager ────────────────────────────
// Model Context Protocol: each connector registers tools here.
// Claude's system prompt receives a summary of available tools + their last output.

export interface MCPTool {
  name: string
  description: string
  connector: string
  invoke: (params?: Record<string, unknown>) => Promise<unknown>
}

const registry = new Map<string, MCPTool>()

export function registerTool(tool: MCPTool): void {
  registry.set(tool.name, tool)
  console.debug(`[MCP] Registered tool: ${tool.name}`)
}

export async function invokeTool(name: string, params?: Record<string, unknown>): Promise<unknown> {
  const tool = registry.get(name)
  if (!tool) throw new Error(`[MCP] Unknown tool: ${name}`)
  try {
    return await tool.invoke(params)
  } catch (err) {
    console.error(`[MCP] Tool ${name} failed:`, err)
    throw err
  }
}

export function listTools(): MCPTool[] {
  return Array.from(registry.values())
}

export function getToolSummary(): string {
  return listTools()
    .map(t => `- ${t.name} (${t.connector}): ${t.description}`)
    .join('\n')
}
