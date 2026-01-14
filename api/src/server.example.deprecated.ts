/**
 * Updated server.ts with new SocketManager integration
 * 
 * This replaces the old SocketService singleton pattern
 */

import express from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import { SocketManager } from "./socket/SocketManager";
import authRoutes from "./routes/authRoutes";
import callRoutes from "./routes/callRoutes";
import complianceRoutes from "./routes/complianceRoutes";
import leadRoutes from "./routes/leadRoutes";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
const httpServer = createServer(app);

// Environment Config
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middleware
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Initialize Socket.IO (NEW - Dependency Injection pattern)
const socketManager = new SocketManager(httpServer, CORS_ORIGIN);

// Make emitter available to routes/services via app.locals
app.locals.socketEmitter = socketManager.getEmitter();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/leads", leadRoutes);

// Health
app.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        sockets: {
            agents: socketManager.getAgentNamespace() ? 'active' : 'inactive',
            supervisors: socketManager.getSupervisorNamespace() ? 'active' : 'inactive'
        }
    });
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('SIGTERM signal received: closing servers');

    // Close Socket.IO first
    await socketManager.shutdown();

    // Then close HTTP server
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
httpServer.listen(PORT, () => {
    console.log(`Global Dialer API & WebSockets running on port ${PORT}`);
});

export default app;
export { socketManager };
