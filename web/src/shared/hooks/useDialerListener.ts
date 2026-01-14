import { useEffect } from 'react';
import { useDialerStore } from '../store/useDialerStore';
import { useFrostEvent } from '../hooks/useFrost';

/**
 * useDialerListener
 * 
 * Orchestrator hook that connects Socket.IO events to the Dialer State Machine.
 * This ensures that the global state always reflects the literal truth from the server.
 */
export function useDialerListener() {
    const {
        handleCallAssigned,
        handleCallRinging,
        handleCallBridged,
        handleCallHeld,
        handleCallResumed,
        handleCallEnded,
        handleCallFailed
    } = useDialerStore();

    // Map Backend Events -> State Machine Inputs
    // We pass the full payload to allow the state machine to verify callId and context.
    useFrostEvent('call.assigned', handleCallAssigned);
    useFrostEvent('call.ringing', handleCallRinging);
    useFrostEvent('call.bridged', handleCallBridged);
    useFrostEvent('call.held', handleCallHeld);
    useFrostEvent('call.resumed', handleCallResumed);
    useFrostEvent('call.ended', handleCallEnded);
    useFrostEvent('call.failed', handleCallFailed);
}
