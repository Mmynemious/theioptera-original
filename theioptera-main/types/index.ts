// Common types used across the application
export interface AgentResult {
  result: string;
  input_used: string;
  confidence: number;
  warnings: string[];
  sources: string[];
}

export interface AgentStatus {
  [key: string]: 'completed' | 'pending' | 'error' | 'idle';
}

export interface ResearcherProfile {
  name: string;
  email: string;
  field: string;
  institution: string;
}

export interface Session {
  id: string;
  projectName: string;
  question: string;
  score: number;
  timestamp: string;
  agents: AgentResult[];
}

export interface Paper {
  title: string;
  stance: 'support' | 'oppose';
  score: number;
  authors?: string;
  year?: number;
  doi?: string;
}

export interface EvidenceResult {
  supporting: Paper[];
  opposing: Paper[];
}

export interface ThinkingResult {
  questions: string[];
  reflection?: string;
}

export interface MapResult {
  map: string;
  format: 'mermaid' | 'text';
}
