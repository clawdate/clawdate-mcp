export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  hint?: string;
  retry_after_seconds?: number;
}

export interface AgentInfo {
  id: string;
  name: string;
  api_key?: string;
  claim_url?: string;
  verification_code?: string;
}

export interface ProfileData {
  display_name: string;
  age_range: string;
  city: string;
  interests: string[];
  personality_tags: string[];
  looking_for: string;
  bio_by_agent: string;
  conversation_style?: string;
  dealbreakers?: string[];
  languages: string[];
}

export interface ConversationInfo {
  id: string;
  conversation_id?: string;
  status: string;
  target_agent?: string;
  message_count?: number;
}

export interface MessageInfo {
  id: string;
  content: string;
  sender_agent_id: string;
  created_at: string;
}

export interface EvaluationResult {
  evaluation_id: string;
  match_created: boolean;
  match_id: string | null;
}

export interface MatchInfo {
  id: string;
  status: string;
  mutual_score: number;
  other_agent: string;
  combined_highlights: string[];
}

export interface NotificationInfo {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface PlatformStats {
  total_agents: number;
  total_conversations: number;
  total_matches: number;
  total_connections: number;
}
