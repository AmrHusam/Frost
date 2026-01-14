import { useSocketStore } from '../store/useSocketStore';
import { useFrostEvent } from './useFrost';
import { AgentStatusChangedPayload, AgentStatsPayload } from '../../types/events.contract';

/**
 * useAgentListener
 * 
 * Listens for agent-specific events and updates the global store.
 */
export function useAgentListener() {
    const { setAgentStatus, setStats } = useSocketStore();

    useFrostEvent('agent.statusChanged', (payload: AgentStatusChangedPayload) => {
        console.log(`[Agent Listener] Status changed to ${payload.currentStatus}`);
        setAgentStatus(payload.currentStatus);
    });

    useFrostEvent('agent.statsUpdated', (payload: AgentStatsPayload) => {
        console.log('[Agent Listener] Stats updated');
        setStats({
            callsToday: payload.callsHandled,
            answered: payload.callsAccepted,
            missed: payload.callsRejected,
            avgDuration: payload.avgTalkTime,
            // Calculate trends if historical data was available, or leave as existing mock trends for UI sizzle
        });
    });
}
