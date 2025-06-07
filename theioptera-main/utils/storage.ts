import { ResearcherProfile, Session, AgentStatus } from '../types';

// localStorage utility functions
export const storage = {
  // Profile management
  getProfile: (): ResearcherProfile | null => {
    if (typeof window === 'undefined') return null;
    const profile = localStorage.getItem('researcher_profile');
    return profile ? JSON.parse(profile) : null;
  },

  setProfile: (profile: ResearcherProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('researcher_profile', JSON.stringify(profile));
  },

  // Session management
  getSessions: (): Session[] => {
    if (typeof window === 'undefined') return [];
    const sessions = localStorage.getItem('research_sessions');
    return sessions ? JSON.parse(sessions) : [];
  },

  addSession: (session: Session): void => {
    if (typeof window === 'undefined') return;
    const sessions = storage.getSessions();
    sessions.unshift(session); // Add to beginning
    localStorage.setItem('research_sessions', JSON.stringify(sessions));
  },

  // Agent status management
  getAgentStatus: (): AgentStatus => {
    if (typeof window === 'undefined') return {};
    const status = localStorage.getItem('agent_status');
    return status ? JSON.parse(status) : {
      'Thesis Agent': 'idle',
      'Search Agent': 'idle',
      'Summarize Agent': 'idle',
      'Trend Agent': 'idle',
      'Hypothesis Agent': 'idle',
      'Evaluate Agent': 'idle',
      'Map Agent': 'idle',
      'Thinking Agent': 'idle',
      'Evidence Agent': 'idle'
    };
  },

  setAgentStatus: (agentName: string, status: 'completed' | 'pending' | 'error' | 'idle'): void => {
    if (typeof window === 'undefined') return;
    const currentStatus = storage.getAgentStatus();
    currentStatus[agentName] = status;
    localStorage.setItem('agent_status', JSON.stringify(currentStatus));
  },

  // Current question for context
  getCurrentQuestion: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('current_question') || '';
  },

  setCurrentQuestion: (question: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('current_question', question);
  }
};
