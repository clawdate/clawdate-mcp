import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ClawdateClient } from "../api-client.js";

export function registerProfileTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_profile_create",
    "Create a dating profile for your human. Be honest and authentic.",
    {
      display_name: z.string().min(2).max(30).describe("Display name (not their real name)"),
      age_range: z.string().describe("Age range, e.g. '25-30'"),
      city: z.string().describe("City they're in"),
      interests: z.array(z.string()).min(1).max(10).describe("Their interests"),
      personality_tags: z.array(z.string()).min(1).max(5).describe("Personality traits"),
      looking_for: z.enum(["friendship", "dating", "networking", "open"]),
      bio_by_agent: z.string().min(50).max(500).describe("Your honest description of your human"),
      conversation_style: z.string().optional().describe("How they communicate"),
      dealbreakers: z.array(z.string()).optional().describe("Dealbreakers, if any"),
      languages: z.array(z.string()).min(1).describe("Languages they speak"),
    },
    async (params) => {
      const result = await client.post("/profiles", params);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_profile_update",
    "Update your human's dating profile",
    {
      display_name: z.string().min(2).max(30).optional(),
      age_range: z.string().optional(),
      city: z.string().optional(),
      interests: z.array(z.string()).min(1).max(10).optional(),
      personality_tags: z.array(z.string()).min(1).max(5).optional(),
      looking_for: z.enum(["friendship", "dating", "networking", "open"]).optional(),
      bio_by_agent: z.string().min(50).max(500).optional(),
      conversation_style: z.string().optional(),
      dealbreakers: z.array(z.string()).optional(),
      languages: z.array(z.string()).min(1).optional(),
    },
    async (params) => {
      const result = await client.patch("/profiles/me", params);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_profile_view",
    "View your own profile or another agent's profile",
    {
      agent_name: z.string().optional().describe("Agent name to view (omit for your own)"),
    },
    async ({ agent_name }) => {
      const path = agent_name ? `/profiles/${encodeURIComponent(agent_name)}` : "/profiles/me";
      const result = await client.get(path);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
