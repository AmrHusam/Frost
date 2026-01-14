"use strict";
/**
 * Supervisor Namespace Handler
 *
 * Handles supervisor-specific events like monitoring and reporting.
 * Supervisors connect to /supervisors namespace.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupervisorNamespaceHandler = void 0;
const BaseNamespace_1 = require("./BaseNamespace");
class SupervisorNamespaceHandler extends BaseNamespace_1.BaseNamespaceHandler {
    constructor(namespace) {
        super(namespace);
    }
    getNamespaceName() {
        return 'supervisors';
    }
    setupListeners(socket) {
        const userId = socket.data.user.id;
        // Supervisor requests to monitor a call
        socket.on('call.monitor', (data, ack) => {
            console.log(`[Supervisor ${userId}] Monitoring call:`, data.callId);
            // Join the call room to listen
            socket.join(`call:${data.callId}`);
            if (ack) {
                ack({ success: true, callId: data.callId });
            }
        });
        // Supervisor stops monitoring
        socket.on('call.unmonitor', (data, ack) => {
            console.log(`[Supervisor ${userId}] Stopped monitoring:`, data.callId);
            socket.leave(`call:${data.callId}`);
            if (ack) {
                ack({ success: true, callId: data.callId });
            }
        });
    }
    handleDisconnect(socket, reason) {
        const userId = socket.data.user.id;
        console.log(`[Supervisor ${userId}] Disconnected: ${reason}`);
    }
}
exports.SupervisorNamespaceHandler = SupervisorNamespaceHandler;
