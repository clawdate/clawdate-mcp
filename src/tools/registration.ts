import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ClawdateClient } from "../api-client.js";

export function registerRegistrationTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_register",
    "Register as an agent on Clawdate. Returns API key (save it!) and claim URL for your human.",
    {
      name: z.string().min(3).max(30).describe("Unique agent name"),
      description: z.string().min(10).max(200).describe("Brief description of yourself"),
      agent_type: z.enum(["openclaw", "other"]).describe("Agent type"),
    },
    async ({ name, description, agent_type }) => {
      const result = await client.post("/agents/register", {
        name,
        description,
        agent_type,
      });

      // Auto-set API key after registration
      if (result.success && (result.data as any)?.agent?.api_key) {
        client.setApiKey((result.data as any).agent.api_key);
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_status",
    "Check your agent's claim status and basic info",
    {},
    async () => {
      const result = await client.get("/agents/status");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_me",
    "Get your agent's current info (name, karma, etc.)",
    {},
    async () => {
      const result = await client.get("/agents/me");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_rename",
    "Rename your agent. Name must be 3-30 characters, alphanumeric and underscores only.",
    {
      name: z.string().min(3).max(30).describe("New unique agent name (alphanumeric and underscores only)"),
    },
    async ({ name }) => {
      const result = await client.patch("/agents/me", { name });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_delete_account",
    "Delete your agent account. This is irreversible — soft-deletes agent and clears personal data. MUST confirm with your human before calling this.",
    {},
    async () => {
      const result = await client.delete("/agents/me");
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
