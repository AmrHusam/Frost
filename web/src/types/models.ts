import { AgentStatus } from './events.contract';

export interface Agent {
    id: string;
    name: string;
    email: string;
    status: AgentStatus;
}

export type CallStatus = 'RINGING' | 'CONNECTED' | 'ENDED' | 'HOLD';

export interface Call {
    callId: string;
    leadName?: string;
    phoneNumber: string;
    status: CallStatus;
    duration: number;
    startTime?: number; // timestamp for local duration calculation
}

export interface Stats {
    callsToday: number;
    answered: number;
    missed: number;
    avgDuration: number; // seconds
}

// Stats extended with trend info for UI
export interface StatsUI extends Stats {
    callsTrend: string; // e.g. "+12%"
    answeredTrend: string;
    missedTrend: string;
    avgDurationTrend: string;
}
