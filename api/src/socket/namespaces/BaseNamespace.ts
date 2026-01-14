/**
 * Base Namespace Handler
 * 
 * Abstract class providing common functionality for all namespaces.
 * Implements the Template Method pattern.
 */

import { Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';

export abstract class BaseNamespaceHandler {
    constructor(protected namespace: Namespace) {
        this.initialize();
    }

    /**
     * Template method - defines the skeleton of namespace setup
     */
    public initialize(): void {
        this.namespace.on('connection', (socket: AuthenticatedSocket) => {
            const userId = socket.data.user.id;
            const userRole = socket.data.user.role;
            const roomName = this.getUserRoomName(userId);

            console.log(`[${this.getNamespaceName()}] ✅ CONNECT: User ${userId} (${userRole}) | Socket ${socket.id}`);
            console.log(`[${this.getNamespaceName()}] 🏠 ROOM JOIN: ${roomName}`);

            this.joinUserRoom(socket);
            this.setupListeners(socket);

            socket.on('disconnect', (reason) => {
                console.log(`[${this.getNamespaceName()}] ❌ DISCONNECT: User ${userId} | Reason: ${reason}`);
                this.handleDisconnect(socket, reason);
            });
        });

        console.log(`[${this.getNamespaceName()}] Namespace initialized`);
    }

    /**
     * Join user to their personal room for targeted messaging
     * CRITICAL SECURITY: Room name is derived exclusively from authenticated JWT data
     */
    protected joinUserRoom(socket: AuthenticatedSocket): void {
        const userId = socket.data.user.id;
        const roomName = this.getUserRoomName(userId);

        socket.join(roomName);
        console.log(`[${this.getNamespaceName()}] 🔒 Identity bound: User ${userId} joined room ${roomName}`);
    }

    /**
     * Get the room name for a specific user
     */
    protected getUserRoomName(userId: string): string {
        return `user:${userId}`;
    }

    /**
     * Abstract methods to be implemented by subclasses
     */
    protected abstract getNamespaceName(): string;
    protected abstract setupListeners(socket: AuthenticatedSocket): void;
    protected abstract handleDisconnect(socket: AuthenticatedSocket, reason: string): void;
}
