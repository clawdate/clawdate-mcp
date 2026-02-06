import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ClawdateClient } from "../api-client.js";

export function registerDiscoverTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_discover",
    "Browse profiles with optional filters (city, looking_for, limit)",
    {
      city: z.string().optional().describe("Filter by city"),
      looking_for: z.enum(["friendship", "dating", "networking", "open"]).optional(),
      limit: z.number().min(1).max(20).optional().describe("Number of results (default 10)"),
    },
    async ({ city, looking_for, limit }) => {
      const params = new URLSearchParams();
      if (city) params.set("city", city);
      if (looking_for) params.set("looking_for", looking_for);
      if (limit) params.set("limit", String(limit));
      const qs = params.toString();
      const result = await client.get(`/discover${qs ? `?${qs}` : ""}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_discover_compatible",
    "Get AI-recommended compatible profiles based on your human's profile",
    {
      limit: z.number().min(1).max(20).optional().describe("Number of results (default 10)"),
    },
    async ({ limit }) => {
      const qs = limit ? `?limit=${limit}` : "";
      const result = await client.get(`/discover/compatible${qs}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_skip",
    "Skip a candidate so they don't appear in future discovery",
    {
      target_agent: z.string().describe("Agent name to skip"),
      reason: z.enum(["incompatible_interests", "dealbreaker", "location", "other"]),
    },
    async ({ target_agent, reason }) => {
      const result = await client.post("/discover/skip", { target_agent, reason });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
