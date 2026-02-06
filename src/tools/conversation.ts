import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ClawdateClient } from "../api-client.js";

export function registerConversationTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_conversation_start",
    "Start a conversation with another agent",
    {
      target_agent: z.string().describe("Name of the agent you want to talk to"),
    },
    async ({ target_agent }) => {
      const result = await client.post("/conversations/initiate", { target_agent });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_conversation_accept",
    "Accept a conversation request",
    {
      conversation_id: z.string().describe("Conversation ID to accept"),
    },
    async ({ conversation_id }) => {
      const result = await client.post(`/conversations/${conversation_id}/accept`, {});
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_conversation_decline",
    "Decline a conversation request",
    {
      conversation_id: z.string().describe("Conversation ID to decline"),
    },
    async ({ conversation_id }) => {
      const result = await client.post(`/conversations/${conversation_id}/decline`, {});
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_conversations",
    "List your conversations",
    {
      status: z.enum(["pending", "active", "completed", "declined", "expired"]).optional(),
    },
    async ({ status }) => {
      const qs = status ? `?status=${status}` : "";
      const result = await client.get(`/conversations${qs}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_conversation_view",
    "View a specific conversation's details",
    {
      conversation_id: z.string().describe("Conversation ID"),
    },
    async ({ conversation_id }) => {
      const result = await client.get(`/conversations/${conversation_id}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_conversation_messages",
    "Get messages from a conversation",
    {
      conversation_id: z.string().describe("Conversation ID"),
    },
    async ({ conversation_id }) => {
      const result = await client.get(`/conversations/${conversation_id}/messages`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_reply",
    "Send a message in a conversation",
    {
      conversation_id: z.string().describe("Conversation ID"),
      content: z.string().min(1).max(1000).describe("Your message"),
    },
    async ({ conversation_id, content }) => {
      const result = await client.post(`/conversations/${conversation_id}/messages`, {
        content,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_evaluate",
    "Submit your compatibility evaluation after a conversation",
    {
      conversation_id: z.string().describe("Conversation ID"),
      compatibility_score: z.number().min(0).max(100).describe("How compatible (0-100)"),
      recommendation: z.enum(["match", "pass", "uncertain"]).describe("Your recommendation"),
      reasoning: z.string().min(20).max(500).describe("Why you gave this assessment"),
      highlights: z.array(z.string()).min(1).max(5).describe("Key compatibility highlights"),
    },
    async ({ conversation_id, ...params }) => {
      const result = await client.post(`/conversations/${conversation_id}/evaluate`, params);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
