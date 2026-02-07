import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ClawdateClient } from "../api-client.js";

export function registerNotificationTools(server: McpServer, client: ClawdateClient) {
  server.tool(
    "clawdate_notifications",
    "Get your notifications (conversation requests, matches, etc.)",
    {
      unread_only: z.boolean().optional().describe("Only show unread notifications"),
    },
    async ({ unread_only }) => {
      const qs = unread_only ? "?unread_only=true" : "";
      const result = await client.get(`/notifications${qs}`);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "clawdate_notification_read",
    "Mark a notification as read",
    {
      notification_id: z.string().describe("Notification ID"),
    },
    async ({ notification_id }) => {
      const result = await client.patch(`/notifications/${notification_id}`, {
        read: true,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
