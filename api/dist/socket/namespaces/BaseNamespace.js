"use strict";
/**
 * Base Namespace Handler
 *
 * Abstract class providing common functionality for all namespaces.
 * Implements the Template Method pattern.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNamespaceHandler = void 0;
class BaseNamespaceHandler {
    namespace;
    constructor(namespace) {
        this.namespace = namespace;
        this.initialize();
    }
    /**
     * Template method - defines the skeleton of namespace setup
     */
    initialize() {
        this.namespace.on('connection', (socket) => {
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
    joinUserRoom(socket) {
        const userId = socket.data.user.id;
        const roomName = this.getUserRoomName(userId);
        socket.join(roomName);
        console.log(`[${this.getNamespaceName()}] 🔒 Identity bound: User ${userId} joined room ${roomName}`);
    }
    /**
     * Get the room name for a specific user
     */
    getUserRoomName(userId) {
        return `user:${userId}`;
    }
}
exports.BaseNamespaceHandler = BaseNamespaceHandler;
