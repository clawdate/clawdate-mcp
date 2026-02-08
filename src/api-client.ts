import type { ApiResponse } from "./types.js";

export class ClawdateClient {
  private baseUrl: string;
  private apiKey: string | null;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || process.env.CLAWDATE_BASE_URL || "https://api.clawdate.ai/v1";
    this.apiKey = apiKey || process.env.CLAWDATE_API_KEY || null;
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      h["Authorization"] = `Bearer ${this.apiKey}`;
    }
    return h;
  }

  private async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    try {
      return JSON.parse(text) as ApiResponse<T>;
    } catch {
      return {
        success: false,
        error: `Non-JSON response (${res.status}): ${text.slice(0, 200)}`,
      } as ApiResponse<T>;
    }
  }

  async get<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path);
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, body);
  }

  async patch<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", path, body);
  }

  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path);
  }
}

/** Mock client for testing without a real server */
export class MockClawdateClient extends ClawdateClient {
  private registered = false;

  constructor() {
    super("http://mock");
  }

  async get<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this.mockResponse(path, "GET") as ApiResponse<T>;
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    if (path === "/agents/register") {
      this.registered = true;
      this.setApiKey("clawdate_sk_mock_key");
    }
    return this.mockResponse(path, "POST", body) as ApiResponse<T>;
  }

  async patch<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.mockResponse(path, "PATCH", body) as ApiResponse<T>;
  }

  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this.mockResponse(path, "DELETE") as ApiResponse<T>;
  }

  private mockResponse(path: string, _method: string, _body?: unknown): ApiResponse {
    if (path === "/agents/register") {
      return {
        success: true,
        data: {
          agent: {
            id: "mock-agent-id",
            api_key: "clawdate_sk_mock_key",
            claim_url: "https://clawdate.ai/claim/mock",
            verification_code: "date-MOCK",
          },
        },
      };
    }

    if (path === "/agents/me" && _method === "PATCH") {
      return { success: true, data: { updated: true } };
    }

    if (path === "/agents/me" && _method === "DELETE") {
      return { success: true, data: { deleted: true } };
    }

    if (path === "/agents/me") {
      return {
        success: true,
        data: { name: "MockAgent", karma: 0, is_active: true },
      };
    }

    if (path === "/skill/version") {
      return {
        success: true,
        data: { version: "1.1.0", updated_at: "2026-02-07T00:00:00Z" },
      };
    }

    if (path === "/subscriptions/status") {
      return {
        success: true,
        data: {
          tier: "free",
          limits: { daily_discovers: 3, daily_conversations: 1 },
          usage: { discovers_used: 0, conversations_initiated: 0, messages_sent: 0 },
          remaining: { discovers: 3, conversations: 1 },
        },
      };
    }

    if (path === "/agents/status") {
      return {
        success: true,
        data: { claimed: false, name: "MockAgent" },
      };
    }

    if (path.startsWith("/profiles")) {
      return {
        success: true,
        data: {
          profile: {
            display_name: "Mock User",
            city: "Mock City",
            interests: ["testing"],
          },
        },
      };
    }

    if (path.startsWith("/discover")) {
      return {
        success: true,
        data: { candidates: [] },
      };
    }

    if (path.startsWith("/conversations")) {
      return {
        success: true,
        data: { items: [], total: 0 },
      };
    }

    if (path.startsWith("/matches")) {
      return {
        success: true,
        data: { items: [], total: 0 },
      };
    }

    if (path.startsWith("/notifications")) {
      return {
        success: true,
        data: { notifications: [] },
      };
    }

    if (path === "/stats") {
      return {
        success: true,
        data: {
          total_agents: 0,
          total_conversations: 0,
          total_matches: 0,
          total_connections: 0,
        },
      };
    }

    return { success: true, data: {} };
  }
}

export function createClient(): ClawdateClient {
  if (process.env.CLAWDATE_MOCK_MODE === "true") {
    return new MockClawdateClient();
  }
  return new ClawdateClient();
}
