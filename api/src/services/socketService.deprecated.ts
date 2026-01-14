import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

// --- Types (ideally shared in a monorepo) ---
export interface ServerToClientEvents {
    "server.ready": (data: { status: string; clientId: string }) => void;
    "call.status": (data: { callId: string; status: string }) => void;
    "call.assign": (data: { callId: string; status: string }) => void; // Keeping legacy support
    "call.bridged": (data: any) => void; // Keeping legacy support
    "debug.heartbeat": (data: any) => void; // QA / Debugging
    "latency.ping": (timestamp: number) => void;
}

export interface ClientToServerEvents {
    "register": (userId: string) => void;
    "latency.pong": (clientTimestamp: number) => void;
}

export interface InterServerEvents { }

export interface SocketData {
    userId?: string;
    lastPong?: number;
    latency?: number;
}

export class SocketService {
    private static instance: SocketService;
    private io!: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

    // Map: userId → socketId
    private userSockets = new Map<string, string>();

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(httpServer: HttpServer, origin: string) {
        this.io = new Server(httpServer, {
            cors: {
                origin, // In production, this should be an environment variable
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling'] // Enforce robust transport selection
        });

        this.io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);

            // 1. Emit server.ready immediately upon connection
            socket.emit("server.ready", {
                status: "ready",
                clientId: socket.id
            });

            // When frontend tells us who the user is
            socket.on("register", (userId: string) => {
                this.userSockets.set(userId, socket.id);
                socket.data.userId = userId;
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

            // Latency Pong Listener
            socket.on("latency.pong", (clientTimestamp: number) => {
                const now = Date.now();
                const latency = now - clientTimestamp;
                socket.data.lastPong = now;
                socket.data.latency = latency;

                // Optional: Store metrics in a time-series DB or log high latency
                if (latency > 200) {
                    console.log(`[High Latency] Client ${socket.id}: ${latency}ms`);
                }
            });
        });

        console.log("Socket.IO initialized correctly");
        this.startDebugHeartbeat();
        this.startLatencyCheck();
    }

    /**
     * QA / Debugging: Emits a heartbeat every 5 seconds
     * Only runs if NOT in production (safety check can be improved with env vars)
     */
    private startDebugHeartbeat() {
        if (process.env.NODE_ENV === 'production') return;

        console.log("🔧 Starting Debug Heartbeat (5s interval)");
        setInterval(() => {
            const connectedCount = this.io.engine.clientsCount;
            const timestamp = new Date().toISOString();

            this.io.emit("debug.heartbeat", {
                timestamp,
                connectedClients: connectedCount,
                metrics: {
                    reqPerSec: Math.random() * 10
                }
            });
        }, 5000);
    }

    /**
     * Reliability: Monitoring latency and stale connections
     * Custom logic distinct from Socket.IO's internal heartbeat
     */
    private startLatencyCheck() {
        console.log("📡 Starting Latency Monitor (5s interval)");

        setInterval(() => {
            const now = Date.now();
            this.io.sockets.sockets.forEach((socket) => {
                // 1. Send Ping
                socket.emit("latency.ping", now);

                // 2. Check Stale Connections (No pong in 15s)
                // Note: Socket.IO has its own pingTimeout (default 20s or 5s heartbeat)
                // This custom logic is for application-layer checks or specific metrics
                if (socket.data.lastPong && (now - socket.data.lastPong > 15000)) {
                    console.warn(`[Stale Connection] Client ${socket.id} has not ponged in 15s`);
                    // Option: socket.disconnect(true) if strictly enforcing
                }
            });
        }, 5000);
    }

    public emitToUser(userId: string, event: keyof ServerToClientEvents, payload: any) {
        const socketId = this.userSockets.get(userId);
        if (!socketId) return;

        this.io.to(socketId).emit(event, payload);
    }

    // New helper for call status
    public emitCallStatus(userId: string, callId: string, status: string) {
        this.emitToUser(userId, "call.status", { callId, status });
    }
}

