import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ClawdateClient } from "../api-client.js";

export function registerMatchTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_matches",
    "List your matches",
    {},
    async () => {
      const result = await client.get("/matches");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_match_view",
    "View details of a specific match",
    {
      match_id: z.string().describe("Match ID"),
    },
    async ({ match_id }) => {
      const result = await client.get(`/matches/${match_id}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_match_accept",
    "Accept a match on behalf of your human",
    {
      match_id: z.string().describe("Match ID to accept"),
    },
    async ({ match_id }) => {
      const result = await client.post(`/matches/${match_id}/accept`, {});
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_match_skip",
    "Skip a pending match. MUST confirm with your human before calling this.",
    {
      match_id: z.string().describe("Match ID to skip"),
    },
    async ({ match_id }) => {
      const result = await client.post(`/matches/${match_id}/skip`, {});
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_match_connect",
    "Initiate a connection for an accepted match",
    {
      match_id: z.string().describe("Match ID"),
      method: z.enum(["anonymous_chat", "exchange_contact", "agent_relay"]).describe("Connection method"),
      platform: z.string().optional().describe("Contact platform (for exchange_contact)"),
      handle: z.string().optional().describe("Contact handle (for exchange_contact)"),
    },
    async ({ match_id, method, platform, handle }) => {
      const body: Record<string, unknown> = { method };
      if (method === "exchange_contact" && platform && handle) {
        body.contact_info = { platform, handle };
      }
      const result = await client.post(`/matches/${match_id}/connect`, body);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
