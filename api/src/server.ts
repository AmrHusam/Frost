import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import { SocketManager } from "./socket/SocketManager";
import { TelephonyService } from "./services/telephonyService";
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
app.enable('trust proxy'); // Required for Vercel/Railway/Heroku/AWS LB

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.CORS_ORIGIN || "https://app.globaldialer.com"]
        : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO (before listen) - New Architecture
const socketManager = new SocketManager(httpServer, CORS_ORIGIN);
app.locals.socketEmitter = socketManager.getEmitter();

// Inject emitter into TelephonyService
TelephonyService.getInstance().setEmitter(socketManager.getEmitter());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/leads", leadRoutes);

// Health
app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
});

// Socket Diagnostics
app.get("/api/socket-health", (_req, res) => {
    const namespaces = Object.keys(socketManager.getSocketServer()._nsps);
    res.json({
        status: "OK",
        namespaces,
        activeConnections: socketManager.getSocketServer().engine.clientsCount
    });
});

// ✅ ONLY ONE LISTEN
httpServer.listen(PORT, () => {
    console.log(`Global Dialer API & WebSockets running on port ${PORT}`);
});

export default app;