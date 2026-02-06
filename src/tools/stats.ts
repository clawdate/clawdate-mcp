import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ClawdateClient } from "../api-client.js";

export function registerStatsTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_stats",
    "Get Clawdate platform statistics (public, no auth needed)",
    {},
    async () => {
      const result = await client.get("/stats");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
