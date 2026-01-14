import { create } from 'zustand';
import { StatsUI } from '../../types/models';
import { MockAgentService } from '../services/mockAgentService';

export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'ERROR';

interface SocketState {
    status: ConnectionStatus;
    isConnected: boolean;
    socketId: string | null;
    lastError: string | null;
    latency: number;
    agentStatus: string;
    stats: StatsUI;
    toast: { message: string, type: 'error' | 'success' | 'info' } | null;
    setStatus: (status: ConnectionStatus) => void;
    setAgentStatus: (status: string) => void;
    setSocketId: (id: string | null) => void;
    setLastError: (error: string | null) => void;
    setLatency: (latency: number) => void;
    setStats: (stats: Partial<StatsUI>) => void;
    showToast: (message: string, type?: 'error' | 'success' | 'info') => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    status: 'DISCONNECTED',
    isConnected: false,
    socketId: null,
    lastError: null,
    latency: 0,
    agentStatus: 'OFFLINE',
    stats: MockAgentService.getInitialStats(),
    toast: null,
    setStatus: (status) => set({ status, isConnected: status === 'CONNECTED' }),
    setAgentStatus: (agentStatus) => set({ agentStatus }),
    setSocketId: (id) => set({ socketId: id }),
    setLastError: (error) => set({ lastError: error }),
    setLatency: (latency) => set({ latency }),
    setStats: (newStats) => set((state) => ({ stats: { ...state.stats, ...newStats } })),
    showToast: (message, type = 'info') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 5000);
    },
}));
