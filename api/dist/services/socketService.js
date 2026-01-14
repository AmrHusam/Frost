"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    static instance;
    io;
    // Map: userId → socketId
    userSockets = new Map();
    constructor() { }
    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }
    initialize(httpServer, origin) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin,
                methods: ["GET", "POST"],
            },
        });
        this.io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);
            // When frontend tells us who the user is
            socket.on("register", (userId) => {
                this.userSockets.set(userId, socket.id);
                console.log(`User ${userId} registered with socket ${socket.id}`);
            });
            socket.on("disconnect", () => {
                for (const [userId, socketId] of this.userSockets.entries()) {
                    if (socketId === socket.id) {
                        this.userSockets.delete(userId);
                        console.log(`User ${userId} disconnected`);
                    }
                }
            });
        });
        console.log("Socket.IO initialized correctly");
    }
    // ✅ THIS IS THE MISSING FUNCTION
    emitToUser(userId, event, payload) {
        const socketId = this.userSockets.get(userId);
        if (!socketId)
            return;
        this.io.to(socketId).emit(event, payload);
    }
}
exports.SocketService = SocketService;
