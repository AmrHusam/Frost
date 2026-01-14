/**
 * Socket Manager
 * 
 * Main orchestrator for Socket.IO initialization.
 * Follows the Composition Root pattern - creates and wires dependencies.
 */

import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerToClientEvents, ClientToServerEvents } from '../types/events.contract';
import { authenticateSocket, requireRole } from './middleware/auth';
import { AgentNamespaceHandler } from './namespaces/AgentNamespace';
import { SupervisorNamespaceHandler } from './namespaces/SupervisorNamespace';
import { TypedEmitter } from './services/TypedEmitter';

export class SocketManager {
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private agentNamespace!: AgentNamespaceHandler;
    private supervisorNamespace!: SupervisorNamespaceHandler;
    private emitter: TypedEmitter;

    constructor(httpServer: HttpServer, corsOrigin: string) {
        // Initialize Socket.IO server
        this.io = new Server(httpServer, {
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
        this.emitter = new TypedEmitter(this.io);

        // Setup Redis adapter for horizontal scaling
        if (process.env.REDIS_URL) {
            this.setupRedisAdapter();
        } else {
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
    private async setupRedisAdapter(): Promise<void> {
        try {
            console.log('🔌 Connecting to Redis...');

            const pubClient = createClient({ url: process.env.REDIS_URL });
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
            this.io.adapter(createAdapter(pubClient, subClient));

            console.log('✅ Redis Adapter connected - horizontal scaling enabled');
        } catch (err) {
            console.error('❌ Redis Adapter failed:', err);
            console.error('   System will run in single-instance mode');
            // Don't throw - allow system to run without Redis
        }
    }

    /**
     * Setup /agents namespace with authentication
     */
    private setupAgentNamespace(): void {
        const agentsNs = this.io.of('/agents');

        // Apply authentication middleware
        agentsNs.use(authenticateSocket);
        agentsNs.use(requireRole(['AGENT', 'ADMIN']));

        // Create handler
        this.agentNamespace = new AgentNamespaceHandler(agentsNs);
    }

    /**
     * Setup /supervisors namespace with stricter auth
     */
    private setupSupervisorNamespace(): void {
        const supervisorsNs = this.io.of('/supervisors');

        // Apply authentication middleware
        supervisorsNs.use(authenticateSocket);
        supervisorsNs.use(requireRole(['SUPERVISOR', 'ADMIN']));

        // Create handler
        this.supervisorNamespace = new SupervisorNamespaceHandler(supervisorsNs);
    }

    /**
     * Start monitoring and health checks
     */
    private startMonitoring(): void {
        if (process.env.NODE_ENV === 'production') return;

        // Latency ping every 5 seconds
        setInterval(() => {
            const timestamp = Date.now();
            this.io.of('/agents').emit('presence.ping', timestamp);
        }, 5000);

        console.log('📡 Latency monitoring started');
    }

    /**
     * Get the typed emitter for dependency injection
     */
    public getEmitter(): TypedEmitter {
        return this.emitter;
    }

    /**
     * Get agent namespace handler (for advanced operations)
     */
    public getAgentNamespace(): AgentNamespaceHandler {
        return this.agentNamespace;
    }

    /**
     * Get supervisor namespace handler
     */
    public getSupervisorNamespace(): SupervisorNamespaceHandler {
        return this.supervisorNamespace;
    }

    /**
     * Graceful shutdown
     */
    public async shutdown(): Promise<void> {
        console.log('Shutting down Socket.IO...');

        // Disconnect all clients
        this.io.disconnectSockets(true);

        // Close server
        await new Promise<void>((resolve) => {
            this.io.close(() => {
                console.log('Socket.IO closed');
                resolve();
            });
        });
    }
    public getSocketServer(): Server<ClientToServerEvents, ServerToClientEvents> {
        return this.io;
    }
}
