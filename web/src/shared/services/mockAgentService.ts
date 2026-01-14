import { Agent, Call, StatsUI } from '../../types/models';

export const MOCK_AGENT: Agent = {
    id: 'agent-007',
    name: 'James Bond',
    email: '007@mi6.gov.uk', // Just kidding, using requested defaults
    status: 'READY'
};

export const MOCK_STATS: StatsUI = {
    callsToday: 42,
    answered: 38,
    missed: 4,
    avgDuration: 245,
    callsTrend: '+12%',
    answeredTrend: '+5%',
    missedTrend: '-2%',
    avgDurationTrend: '+15s'
};

export const MOCK_CALL: Call = {
    callId: 'call-123',
    leadName: 'Auric Goldfinger',
    phoneNumber: '+1 555 007 0001',
    status: 'CONNECTED',
    duration: 120,
    startTime: Date.now() - 120000
};

export class MockAgentService {
    static getInitialStats(): StatsUI {
        return MOCK_STATS;
    }

    static getInitialContacts() {
        return [
            { id: '1', name: 'Alice Chen', phone: '(555) 012-3456', status: 'NEW' },
            { id: '2', name: 'Marcus Rodriguez', phone: '(555) 018-2938', status: 'FOLLOW_UP' },
            { id: '3', name: 'Sarah Johnson', phone: '(555) 019-9876', status: 'BUSY' },
            { id: '4', name: 'David Kim', phone: '(555) 014-5678', status: 'NEW' },
            { id: '5', name: 'Emily Davis', phone: '(555) 016-7890', status: 'DNC' },
        ];
    }
}
