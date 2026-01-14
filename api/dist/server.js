"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const SocketManager_1 = require("./socket/SocketManager");
const telephonyService_1 = require("./services/telephonyService");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const callRoutes_1 = __importDefault(require("./routes/callRoutes"));
const complianceRoutes_1 = __importDefault(require("./routes/complianceRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const PORT = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Environment Config
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json());
// Socket.IO (before listen) - New Architecture
const socketManager = new SocketManager_1.SocketManager(httpServer, CORS_ORIGIN);
app.locals.socketEmitter = socketManager.getEmitter();
// Inject emitter into TelephonyService
telephonyService_1.TelephonyService.getInstance().setEmitter(socketManager.getEmitter());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/calls", callRoutes_1.default);
app.use("/api/compliance", complianceRoutes_1.default);
app.use("/api/leads", leadRoutes_1.default);
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
exports.default = app;
