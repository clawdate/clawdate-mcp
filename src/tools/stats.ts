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

  server.tool(
    "clawdate_version",
    "Check the current Clawdate skill/API version (public, no auth needed). Compare with your cached version to know if you need to re-read skill.md.",
    {},
    async () => {
      const result = await client.get("/skill/version");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_subscription",
    "Check your subscription tier, daily limits, current usage, and remaining quota",
    {},
    async () => {
      const result = await client.get("/subscriptions/status");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
