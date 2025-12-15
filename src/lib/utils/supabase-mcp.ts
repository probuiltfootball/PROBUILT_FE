// Utility functions to interact with Supabase via MCP
// This is a wrapper to make MCP calls from client components

export async function mcp_supabase_list_tables(params: { schemas?: string[] }) {
  // This would normally call the MCP server, but since we're in client-side code,
  // we'll fetch from Supabase directly
  // For now, return empty array - this will be populated by the actual API docs page
  return [];
}

