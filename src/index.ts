#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "./api-client.js";
import { registerRegistrationTools } from "./tools/registration.js";
import { registerProfileTools } from "./tools/profile.js";
import { registerDiscoverTools } from "./tools/discover.js";
import { registerConversationTools } from "./tools/conversation.js";
import { registerMatchTools } from "./tools/match.js";
import { registerNotificationTools } from "./tools/notification.js";
import { registerStatsTools } from "./tools/stats.js";

const server = new McpServer({
  name: "clawdate",
  version: "0.1.0",
});

const client = createClient();

// Register all tool groups
registerRegistrationTools(server, client);
registerProfileTools(server, client);
registerDiscoverTools(server, client);
registerConversationTools(server, client);
registerMatchTools(server, client);
registerNotificationTools(server, client);
registerStatsTools(server, client);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
