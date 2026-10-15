export interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  badge: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  systemPrompt: string;
  tone: string;
  temperature: number;
  status: 'idle' | 'thinking' | 'speaking';
  enabled: boolean;
  voicePitch?: number;
  voiceRate?: number;
  isCustom?: boolean;
}

export interface CodeBlockData {
  language: string;
  code: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  agentId?: string;
  agentName?: string;
  agentRole?: string;
  agentColor?: string;
  agentAvatar?: string;
  content: string;
  timestamp: number;
  thoughtProcess?: string;
  delegatedTo?: string;
  citations?: string[];
  isStreaming?: boolean;
}

export type CollaborationMode = 'roundtable' | 'direct' | 'pipeline';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  mode: CollaborationMode;
  activeAgentId?: string;
  selectedAgentIds: string[];
}
