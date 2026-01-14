/**
 * Typed Event Emitter Service
 * 
 * Provides type-safe methods for emitting events to specific users or rooms.
 * Uses types directly from the authoritative event contract.
 * 
 * CRITICAL: Zero 'any' types allowed.
 */

import { Server } from 'socket.io';
import {
    ServerToClientEvents,
    ClientToServerEvents,
    CallAssignedPayload,
    CallRingingPayload,
    CallBridgedPayload,
    CallEndedPayload,
    AgentStatusChangedPayload,
    SystemNotificationPayload,
    SystemMaintenancePayload
} from '../../types/events.contract';

export class TypedEmitter {
    constructor(
        private io: Server<ClientToServerEvents, ServerToClientEvents>
    ) { }

    /**
     * Emit to a specific agent by userId
     */
    public toAgent(userId: string) {
        const roomName = `user:${userId}`;
        return {
            emitAssigned: (data: CallAssignedPayload) => {
                this.io.of('/agents').to(roomName).emit('call.assigned', data);
            },
            emitRinging: (data: CallRingingPayload) => {
                this.io.of('/agents').to(roomName).emit('call.ringing', data);
            },
            emitBridged: (data: CallBridgedPayload) => {
                this.io.of('/agents').to(roomName).emit('call.bridged', data);
            },
            emitEnded: (data: CallEndedPayload) => {
                this.io.of('/agents').to(roomName).emit('call.ended', data);
            },
            emitStatusChanged: (data: AgentStatusChangedPayload) => {
                this.io.of('/agents').to(roomName).emit('agent.statusChanged', data);
            }
        };
    }

    /**
     * Emit to all supervisors
     */
    public toAllSupervisors() {
        return {
            emitAgentUpdate: (data: AgentStatusChangedPayload) => {
                this.io.of('/supervisors').emit('agent.statusChanged', data);
            },
            emitSystemNotification: (data: SystemNotificationPayload) => {
                this.io.of('/supervisors').emit('system.notification', data);
            }
        };
    }

    /**
     * Emit to everyone in a call room
     */
    public toCallRoom(callId: string) {
        const roomName = `call:${callId}`;
        return {
            emitBridged: (data: CallBridgedPayload) => {
                this.io.of('/agents').to(roomName).emit('call.bridged', data);
                this.io.of('/supervisors').to(roomName).emit('call.bridged', data);
            },
            emitEnded: (data: CallEndedPayload) => {
                this.io.of('/agents').to(roomName).emit('call.ended', data);
                this.io.of('/supervisors').to(roomName).emit('call.ended', data);
            }
        };
    }

    /**
     * Broadcast to all connected clients
     */
    public broadcast() {
        return {
            emitMaintenance: (data: SystemMaintenancePayload) => {
                this.io.emit('system.maintenance', data);
            }
        };
    }
}
