"use strict";
/**
 * Agent Namespace Handler
 *
 * Handles all agent-specific Socket.IO events and logic.
 * Agents connect to /agents namespace.
 *
 * CRITICAL: All inbound events are validated with Zod schemas.
 * Invalid payloads are rejected before reaching business logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentNamespaceHandler = void 0;
const BaseNamespace_1 = require("./BaseNamespace");
const schemas_1 = require("../validation/schemas");
class AgentNamespaceHandler extends BaseNamespace_1.BaseNamespaceHandler {
    constructor(namespace) {
        super(namespace);
    }
    getNamespaceName() {
        return '/agents';
    }
    setupListeners(socket) {
        const userId = socket.data.user.id;
        const userRole = socket.data.user.role;
        // ====================================================================
        // AGENT STATUS CHANGE
        // ====================================================================
        socket.on('agent.setStatus', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.AgentSetStatusSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: agent.setStatus`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT - do not process
            }
            // Validation passed - safe to process
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Status change: ${validData.status}`);
            // Business logic here (update DB, broadcast to supervisors)
            if (ack) {
                ack({
                    success: true,
                    newStatus: validData.status,
                    effectiveAt: Date.now()
                });
            }
        });
        // ====================================================================
        // CALL ACCEPT
        // ====================================================================
        socket.on('call.accept', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.CallAcceptSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: call.accept`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT
            }
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Accepting call: ${validData.callId}`);
            // Business logic: Update telephony system, update call state
            if (ack) {
                ack({
                    success: true,
                    callId: validData.callId,
                    newState: 'BRIDGED'
                });
            }
        });
        // ====================================================================
        // CALL REJECT
        // ====================================================================
        socket.on('call.reject', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.CallRejectSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: call.reject`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT
            }
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Rejecting call: ${validData.callId} (${validData.reason})`);
            // Business logic
            if (ack) {
                ack({
                    success: true,
                    callId: validData.callId
                });
            }
        });
        // ====================================================================
        // CALL HOLD
        // ====================================================================
        socket.on('call.hold', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.CallHoldSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: call.hold`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT
            }
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Holding call: ${validData.callId}`);
            // Business logic
            if (ack) {
                ack({
                    success: true,
                    callId: validData.callId
                });
            }
        });
        // ====================================================================
        // CALL RESUME
        // ====================================================================
        socket.on('call.resume', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.CallResumeSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: call.resume`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT
            }
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Resuming call: ${validData.callId}`);
            // Business logic
            if (ack) {
                ack({
                    success: true,
                    callId: validData.callId
                });
            }
        });
        // ====================================================================
        // CALL HANGUP
        // ====================================================================
        socket.on('call.hangup', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.CallHangupSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: call.hangup`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT
            }
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Hanging up call: ${validData.callId}`);
            // Business logic
            if (ack) {
                ack({
                    success: true,
                    callId: validData.callId
                });
            }
        });
        // ====================================================================
        // CALL DISPOSITION
        // ====================================================================
        socket.on('call.submitDisposition', (data, ack) => {
            const validation = (0, schemas_1.validatePayload)(schemas_1.CallDispositionSchema, data);
            if (!validation.success) {
                console.error(`[Agent ${userId}] ❌ VALIDATION FAILED: call.submitDisposition`, validation.error);
                if (ack) {
                    ack({
                        success: false,
                        error: validation.error
                    });
                }
                return; // REJECT
            }
            const validData = validation.data;
            console.log(`[Agent ${userId}] ✅ Submitting disposition for call: ${validData.callId}`);
            // Business logic: Save disposition to database
            if (ack) {
                ack({
                    success: true
                });
            }
        });
        // ====================================================================
        // LATENCY MONITORING (No validation needed - simple number)
        // ====================================================================
        socket.on('latency.pong', (timestamp) => {
            if (typeof timestamp !== 'number' || timestamp < 0) {
                console.warn(`[Agent ${userId}] ⚠️ Invalid latency.pong timestamp`);
                return;
            }
            const latency = Date.now() - timestamp;
            socket.data.latency = latency;
            if (latency > 200) {
                console.warn(`[Agent ${userId}] ⚠️ High latency: ${latency}ms`);
            }
        });
    }
    handleDisconnect(socket, reason) {
        const userId = socket.data.user.id;
        console.log(`[Agent ${userId}] Disconnected: ${reason}`);
        // In production: Update agent status to OFFLINE, notify supervisors
    }
    /**
     * Join agent to a call room for multi-party communication
     */
    joinCallRoom(userId, callId) {
        const roomName = `call:${callId}`;
        this.namespace.in(this.getUserRoomName(userId)).socketsJoin(roomName);
        console.log(`[Agent ${userId}] Joined call room: ${roomName}`);
    }
    /**
     * Remove agent from call room
     */
    leaveCallRoom(userId, callId) {
        const roomName = `call:${callId}`;
        this.namespace.in(this.getUserRoomName(userId)).socketsLeave(roomName);
        console.log(`[Agent ${userId}] Left call room: ${roomName}`);
    }
}
exports.AgentNamespaceHandler = AgentNamespaceHandler;
