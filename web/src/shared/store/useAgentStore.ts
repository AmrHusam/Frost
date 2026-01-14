import { create } from 'zustand';

export type AgentStatus = 'OFFLINE' | 'READY' | 'NOT_READY' | 'ON_CALL' | 'WRAPUP';

interface CallData {
    id: string;
    leadId: string;
    customerName: string;
    customerPhone: string;
    campaignName: string;
    scriptBody: string; // Markdown content
}

interface AgentState {
    status: AgentStatus;
    activeCall: CallData | null;
    setStatus: (status: AgentStatus) => void;
    setCall: (call: CallData | null) => void;
    startTime: number | null; // For timer
}

export const useAgentStore = create<AgentState>((set) => ({
    status: 'OFFLINE',
    activeCall: null,
    startTime: null,
    setStatus: (status) => set({ status, startTime: Date.now() }),
    setCall: (call) => set({
        activeCall: call,
        status: call ? 'ON_CALL' : 'WRAPUP'
    }),
}));
