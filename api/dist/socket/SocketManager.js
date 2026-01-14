"use strict";
/**
 * Socket Manager
 *
 * Main orchestrator for Socket.IO initialization.
 * Follows the Composition Root pattern - creates and wires dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const auth_1 = require("./middleware/auth");
const AgentNamespace_1 = require("./namespaces/AgentNamespace");
const SupervisorNamespace_1 = require("./namespaces/SupervisorNamespace");
const TypedEmitter_1 = require("./services/TypedEmitter");
class SocketManager {
    io;
    agentNamespace;
    supervisorNamespace;
    emitter;
    constructor(httpServer, corsOrigin) {
        // Initialize Socket.IO server
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: corsOrigin,
                methods: ['GET', 'POST'],
                credentials: true
            },
            transports: ['websocket', 'polling'],
            pingInterval: 25000,
            pingTimeout: 20000
        });
        // Create typed emitter
        this.emitter = new TypedEmitter_1.TypedEmitter(this.io);
        // Setup Redis adapter for horizontal scaling
        if (process.env.REDIS_URL) {
            this.setupRedisAdapter();
        }
        else {
            console.warn('⚠️  REDIS_URL not set - running in single-instance mode');
            console.warn('   For production, set REDIS_URL to enable horizontal scaling');
        }
        // Setup namespaces
        this.setupAgentNamespace();
        this.setupSupervisorNamespace();
        this.startMonitoring();
        console.log('✅ Socket.IO Manager initialized');
    }
    /**
     * Setup Redis Adapter for horizontal scaling
     */
    async setupRedisAdapter() {
        try {
            console.log('🔌 Connecting to Redis...');
            const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
            const subClient = pubClient.duplicate();
            // Error handlers
            pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err));
            subClient.on('error', (err) => console.error('Redis Sub Client Error:', err));
            // Connect both clients
            await Promise.all([
                pubClient.connect(),
                subClient.connect()
            ]);
            // Apply adapter to Socket.IO
            this.io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            console.log('✅ Redis Adapter connected - horizontal scaling enabled');
        }
        catch (err) {
            console.error('❌ Redis Adapter failed:', err);
            console.error('   System will run in single-instance mode');
            // Don't throw - allow system to run without Redis
        }
    }
    /**
     * Setup /agents namespace with authentication
     */
    setupAgentNamespace() {
        const agentsNs = this.io.of('/agents');
        // Apply authentication middleware
        agentsNs.use(auth_1.authenticateSocket);
        agentsNs.use((0, auth_1.requireRole)(['AGENT', 'ADMIN']));
        // Create handler
        this.agentNamespace = new AgentNamespace_1.AgentNamespaceHandler(agentsNs);
    }
    /**
     * Setup /supervisors namespace with stricter auth
     */
    setupSupervisorNamespace() {
        const supervisorsNs = this.io.of('/supervisors');
        // Apply authentication middleware
        supervisorsNs.use(auth_1.authenticateSocket);
        supervisorsNs.use((0, auth_1.requireRole)(['SUPERVISOR', 'ADMIN']));
        // Create handler
        this.supervisorNamespace = new SupervisorNamespace_1.SupervisorNamespaceHandler(supervisorsNs);
    }
    /**
     * Start monitoring and health checks
     */
    startMonitoring() {
        if (process.env.NODE_ENV === 'production')
            return;
        // Latency ping every 5 seconds
        setInterval(() => {
            const timestamp = Date.now();
            this.io.of('/agents').emit('latency.ping', timestamp);
        }, 5000);
        console.log('📡 Latency monitoring started');
    }
    /**
     * Get the typed emitter for dependency injection
     */
    getEmitter() {
        return this.emitter;
    }
    /**
     * Get agent namespace handler (for advanced operations)
     */
    getAgentNamespace() {
        return this.agentNamespace;
    }
    /**
     * Get supervisor namespace handler
     */
    getSupervisorNamespace() {
        return this.supervisorNamespace;
    }
    /**
     * Graceful shutdown
     */
    async shutdown() {
        console.log('Shutting down Socket.IO...');
        // Disconnect all clients
        this.io.disconnectSockets(true);
        // Close server
        await new Promise((resolve) => {
            this.io.close(() => {
                console.log('Socket.IO closed');
                resolve();
            });
        });
    }
    getSocketServer() {
        return this.io;
    }
}
exports.SocketManager = SocketManager;
