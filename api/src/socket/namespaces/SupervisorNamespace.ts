/**
 * Supervisor Namespace Handler
 * 
 * Handles supervisor-specific events like monitoring and reporting.
 * Supervisors connect to /supervisors namespace.
 */

import { Namespace } from 'socket.io';
import { BaseNamespaceHandler } from './BaseNamespace';
import { AuthenticatedSocket } from '../middleware/auth';

export class SupervisorNamespaceHandler extends BaseNamespaceHandler {
    constructor(namespace: Namespace) {
        super(namespace);
    }

    protected getNamespaceName(): string {
        return 'supervisors';
    }

    protected setupListeners(socket: AuthenticatedSocket): void {
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

    protected handleDisconnect(socket: AuthenticatedSocket, reason: string): void {
        const userId = socket.data.user.id;
        console.log(`[Supervisor ${userId}] Disconnected: ${reason}`);
    }
}
