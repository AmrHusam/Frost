"use strict";
/**
 * Typed Event Emitter Service
 *
 * Provides type-safe methods for emitting events to specific users or rooms.
 * Uses types directly from the authoritative event contract.
 *
 * CRITICAL: Zero 'any' types allowed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEmitter = void 0;
class TypedEmitter {
    io;
    constructor(io) {
        this.io = io;
    }
    /**
     * Emit to a specific agent by userId
     */
    toAgent(userId) {
        const roomName = `user:${userId}`;
        return {
            emitAssigned: (data) => {
                this.io.of('/agents').to(roomName).emit('call.assigned', data);
            },
            emitRinging: (data) => {
                this.io.of('/agents').to(roomName).emit('call.ringing', data);
            },
            emitBridged: (data) => {
                this.io.of('/agents').to(roomName).emit('call.bridged', data);
            },
            emitEnded: (data) => {
                this.io.of('/agents').to(roomName).emit('call.ended', data);
            },
            emitStatusChanged: (data) => {
                this.io.of('/agents').to(roomName).emit('agent.statusChanged', data);
            }
        };
    }
    /**
     * Emit to all supervisors
     */
    toAllSupervisors() {
        return {
            emitAgentUpdate: (data) => {
                this.io.of('/supervisors').emit('agent.statusChanged', data);
            },
            emitSystemNotification: (data) => {
                this.io.of('/supervisors').emit('system.notification', data);
            }
        };
    }
    /**
     * Emit to everyone in a call room
     */
    toCallRoom(callId) {
        const roomName = `call:${callId}`;
        return {
            emitBridged: (data) => {
                this.io.of('/agents').to(roomName).emit('call.bridged', data);
                this.io.of('/supervisors').to(roomName).emit('call.bridged', data);
            },
            emitEnded: (data) => {
                this.io.of('/agents').to(roomName).emit('call.ended', data);
                this.io.of('/supervisors').to(roomName).emit('call.ended', data);
            }
        };
    }
    /**
     * Broadcast to all connected clients
     */
    broadcast() {
        return {
            emitMaintenance: (data) => {
                this.io.emit('system.maintenance', data);
            }
        };
    }
}
exports.TypedEmitter = TypedEmitter;
