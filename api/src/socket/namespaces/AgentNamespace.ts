/**
 * Agent Namespace Handler
 * 
 * Handles all agent-specific Socket.IO events and logic.
 * Agents connect to /agents namespace.
 */

import { Namespace } from 'socket.io';
import { BaseNamespaceHandler } from './BaseNamespace';
import { AuthenticatedSocket } from '../middleware/auth';
import {
    AgentSetStatusSchema,
    CallAcceptSchema,
    CallRejectSchema,
    CallHoldSchema,
    CallResumeSchema,
    CallHangupSchema,
    CallInitiateSchema,
    CallDispositionSchema,
    validatePayload,
    isValidationSuccess
} from '../validation/schemas';
import { CallInitiatePayload } from '../../types/events.contract';

export class AgentNamespaceHandler extends BaseNamespaceHandler {
    constructor(namespace: Namespace) {
        super(namespace);
    }

    protected getNamespaceName(): string {
        return '/agents';
    }

    protected setupListeners(socket: AuthenticatedSocket): void {
        const userId = socket.data.user.id;

        // Emit initial status
        socket.emit('agent.statusChanged', {
            status: 'READY',
            effectiveAt: Date.now()
        });

        // ====================================================================
        // AGENT STATUS CHANGE
        // ====================================================================
        socket.on('agent.setStatus', (data, ack) => {
            const validation = validatePayload(AgentSetStatusSchema, data);

            if (!isValidationSuccess(validation)) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: agent.setStatus`, validation.error);
                if (ack) ack({ success: false, error: validation.error });
                return;
            }

            console.log(`[Agent ${userId}] ✅ Status change: ${validation.data.status}`);

            // Update state (in production this would interact with a Redis/State service)
            // For now, we just acknowledge the contract requirements.

            if (ack) {
                ack({
                    success: true,
                    newStatus: validation.data.status,
                    effectiveAt: Date.now()
                });
            }
        });

        // ====================================================================
        // CALL ACTIONS
        // ====================================================================

        socket.on('call.initiate', (data, ack) => {
            const userId = socket.data.user.id;
            const validation = validatePayload(CallInitiateSchema, data);

            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }

            const callId = `call_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`[Agent ${userId}] ✅ Initiating call: ${validation.data.customerNumber} (ID: ${callId})`);

            // Acknowledge the command initiation
            if (ack) ack({ success: true, callId });

            // Simulate the backend process: Trigger the reactive event
            // In a real system, this would happen after the telephony engine confirms the call
            setTimeout(() => {
                socket.emit('call.assigned', {
                    v: 1,
                    callId,
                    direction: 'OUTBOUND',
                    customerNumber: validation.data.customerNumber,
                    campaignId: validation.data.campaignId || 'manual-dial',
                    campaignName: 'Manual Outbound',
                    priority: 1
                });
            }, 500);
        });

        socket.on('call.accept', (data, ack) => {
            const validation = validatePayload(CallAcceptSchema, data);
            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }
            console.log(`[Agent ${userId}] ✅ Accepting call: ${validation.data.callId}`);
            if (ack) ack({ success: true, callId: validation.data.callId, newState: 'BRIDGED' });
        });

        socket.on('call.reject', (data, ack) => {
            const validation = validatePayload(CallRejectSchema, data);
            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }
            console.log(`[Agent ${userId}] ✅ Rejecting call: ${validation.data.callId}`);
            if (ack) ack({ success: true, callId: validation.data.callId });
        });

        socket.on('call.hold', (data, ack) => {
            const validation = validatePayload(CallHoldSchema, data);
            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }
            console.log(`[Agent ${userId}] ✅ Holding call: ${validation.data.callId}`);
            if (ack) ack({ success: true, callId: validation.data.callId });
        });

        socket.on('call.resume', (data, ack) => {
            const validation = validatePayload(CallResumeSchema, data);
            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }
            console.log(`[Agent ${userId}] ✅ Resuming call: ${validation.data.callId}`);
            if (ack) ack({ success: true, callId: validation.data.callId });
        });

        socket.on('call.hangup', (data, ack) => {
            const validation = validatePayload(CallHangupSchema, data);
            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }
            console.log(`[Agent ${userId}] ✅ Hanging up call: ${validation.data.callId}`);
            if (ack) ack({ success: true, callId: validation.data.callId });
        });

        socket.on('call.submitDisposition', (data, ack) => {
            const validation = validatePayload(CallDispositionSchema, data);
            if (!isValidationSuccess(validation)) {
                if (ack) ack({ success: false, error: validation.error });
                return;
            }
            console.log(`[Agent ${userId}] ✅ Disposition submitted for ${validation.data.callId}`);
            if (ack) ack({ success: true });
        });

        // ====================================================================
        // MONITORING
        // ====================================================================
        socket.on('presence.pong', (timestamp: number) => {
            const latency = Date.now() - timestamp;
            (socket.data as any).latency = latency;
            if (latency > 200) console.warn(`[Agent ${userId}] ⚠️ High latency: ${latency}ms`);
        });
    }

    protected handleDisconnect(socket: AuthenticatedSocket, reason: string): void {
        const userId = socket.data.user.id;
        console.log(`[Agent ${userId}] Disconnected: ${reason}`);
    }

    public joinCallRoom(userId: string, callId: string): void {
        const roomName = `call:${callId}`;
        this.namespace.in(this.getUserRoomName(userId)).socketsJoin(roomName);
    }

    public leaveCallRoom(userId: string, callId: string): void {
        const roomName = `call:${callId}`;
        this.namespace.in(this.getUserRoomName(userId)).socketsLeave(roomName);
    }
}
