import { create } from 'zustand';
import {
    CallDirection,
    CallAssignedPayload,
    CallBridgedPayload,
    CallEndedPayload,
    CallFailedPayload,
    CallRingingPayload,
    CallHeldPayload,
    CallResumedPayload
} from '../../types/events.contract';

export type TelephonyState =
    | 'IDLE'
    | 'DIALING'
    | 'RINGING'
    | 'CONNECTED'
    | 'HOLD'
    | 'ENDED'
    | 'FAILED';

interface CallContext {
    callId: string | null;
    direction: CallDirection | null;
    customerNumber: string | null;
    customerName?: string;
    startTime?: number;
    endTime?: number;
    error?: string;
}

interface DialerState {
    state: TelephonyState;
    context: CallContext;

    // Transition Guards & Logic
    handleCallAssigned: (payload: CallAssignedPayload) => void;
    handleCallRinging: (payload: CallRingingPayload) => void;
    handleCallBridged: (payload: CallBridgedPayload) => void;
    handleCallHeld: (payload: CallHeldPayload) => void;
    handleCallResumed: (payload: CallResumedPayload) => void;
    handleCallEnded: (payload: CallEndedPayload) => void;
    handleCallFailed: (payload: CallFailedPayload) => void;

    // Manual Transitions
    reset: () => void;
    setNumber: (number: string) => void;
}

const INITIAL_CONTEXT: CallContext = {
    callId: null,
    direction: null,
    customerNumber: null,
};

/**
 * DETERMINISTIC STATE MACHINE: Valid Transitions Table
 */
const VALID_TRANSITIONS: Record<TelephonyState, TelephonyState[]> = {
    IDLE: ['DIALING', 'RINGING'],
    DIALING: ['RINGING', 'ENDED', 'FAILED'],
    RINGING: ['CONNECTED', 'ENDED', 'FAILED'],
    CONNECTED: ['HOLD', 'ENDED', 'FAILED'],
    HOLD: ['CONNECTED', 'ENDED', 'FAILED'],
    ENDED: ['IDLE'],
    FAILED: ['IDLE'],
};

const canTransition = (from: TelephonyState, to: TelephonyState): boolean => {
    return VALID_TRANSITIONS[from].includes(to);
};

export const useDialerStore = create<DialerState>((set, get) => ({
    state: 'IDLE',
    context: INITIAL_CONTEXT,

    handleCallAssigned: (payload) => {
        const { state } = get();
        const nextState = payload.direction === 'OUTBOUND' ? 'DIALING' : 'RINGING';

        if (!canTransition(state, nextState)) {
            console.warn(`[State Machine] Illegal transition attempted: ${state} -> ${nextState}`);
            return;
        }

        console.log(`[State Machine] Transition: ${state} -> ${nextState} (ID: ${payload.callId})`);

        set({
            state: nextState,
            context: {
                callId: payload.callId,
                direction: payload.direction,
                customerNumber: payload.customerNumber,
                customerName: payload.customerName,
            }
        });
    },

    handleCallRinging: (payload) => {
        const { state, context } = get();
        if (context.callId !== payload.callId) return;

        if (state === 'DIALING' && canTransition(state, 'RINGING')) {
            console.log(`[State Machine] Transition: DIALING -> RINGING`);
            set({ state: 'RINGING' });
        }
    },

    handleCallBridged: (payload) => {
        const { state, context } = get();
        if (context.callId !== payload.callId) return;

        if (canTransition(state, 'CONNECTED')) {
            console.log(`[State Machine] Transition: ${state} -> CONNECTED`);
            set({
                state: 'CONNECTED',
                context: {
                    ...context,
                    startTime: payload.bridgedAt,
                    customerName: payload.leadData?.name || context.customerName,
                }
            });
        }
    },

    handleCallHeld: (payload) => {
        const { state, context } = get();
        if (context.callId !== payload.callId) return;

        if (canTransition(state, 'HOLD')) {
            console.log(`[State Machine] Transition: CONNECTED -> HOLD`);
            set({ state: 'HOLD' });
        }
    },

    handleCallResumed: (payload) => {
        const { state, context } = get();
        if (context.callId !== payload.callId) return;

        if (canTransition(state, 'CONNECTED')) {
            console.log(`[State Machine] Transition: HOLD -> CONNECTED`);
            set({ state: 'CONNECTED' });
        }
    },

    handleCallEnded: (payload) => {
        const { state, context } = get();
        if (context.callId && context.callId !== payload.callId) return;

        if (canTransition(state, 'ENDED')) {
            console.log(`[State Machine] Transition: ${state} -> ENDED`);
            set({
                state: 'ENDED',
                context: {
                    ...context,
                    endTime: payload.endedAt
                }
            });
        }
    },

    handleCallFailed: (payload) => {
        const { state, context } = get();
        if (context.callId && context.callId !== payload.callId) return;

        if (canTransition(state, 'FAILED')) {
            console.error(`[State Machine] FAILED: ${payload.errorMessage}`);
            set({
                state: 'FAILED',
                context: {
                    ...context,
                    error: payload.errorMessage
                }
            });
        }
    },

    reset: () => {
        const { state } = get();
        if (canTransition(state, 'IDLE')) {
            set({ state: 'IDLE', context: INITIAL_CONTEXT });
        }
    },

    setNumber: (number: string) => {
        set((state) => ({
            context: {
                ...state.context,
                customerNumber: number
            }
        }));
    }
}));

export const useDialerActions = () => {
    const state = useDialerStore(s => s.state);

    return {
        canHold: state === 'CONNECTED',
        canResume: state === 'HOLD',
        canHangup: ['DIALING', 'RINGING', 'CONNECTED', 'HOLD'].includes(state),
        canDial: state === 'IDLE',
        canReset: ['ENDED', 'FAILED'].includes(state),
    };
};
