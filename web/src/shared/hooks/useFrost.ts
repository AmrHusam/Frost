import { useEffect } from 'react';
import { frostSocket } from '../services/frostSocket';
import { ServerToClientEvents, ClientToServerEvents } from '../../types/events.contract';

/**
 * useFrostEvent
 * 
 * Custom hook for listening to Frost socket events with absolute type safety.
 * Handles automatic cleanup on unmount.
 * 
 * @example
 * useFrostEvent('call.assigned', (data) => {
 *   console.log('New call assigned:', data.callId);
 * });
 */
export function useFrostEvent<E extends keyof ServerToClientEvents>(
    event: E,
    callback: ServerToClientEvents[E]
) {
    useEffect(() => {
        return frostSocket.on(event as any, callback as any);
    }, [event, callback]);
}

/**
 * useFrostCommands
 * 
 * Hook providing strictly typed emission helpers for interacting with the backend.
 * Fails at compile time if an event or payload is invalid.
 */
export function useFrostCommands() {
    return {
        /**
         * Strictly typed emit helper
         */
        emit: <E extends keyof ClientToServerEvents>(
            event: E,
            ...args: Parameters<ClientToServerEvents[E]>
        ) => {
            frostSocket.emit(event as any, ...args as any);
        }
    };
}
