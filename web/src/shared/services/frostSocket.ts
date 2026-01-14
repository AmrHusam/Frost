import { io, Socket as SocketIOClient } from 'socket.io-client';
import {
    ServerToClientEvents,
    ClientToServerEvents
} from '../../types/events.contract';
import { useSocketStore } from '../store/useSocketStore';
import { useAuthStore } from '../store/useAuthStore';
import { config } from '../config';

// Environment Driven URL
// Environment Driven URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || config.SOCKET_URL;

// Production safety: Enforce wss if in a secure context or non-localhost
const getFinalUrl = (url: string) => {
    if (!url) return '';
    // Strict Production Check
    if (import.meta.env.VITE_APP_ENV === 'production' && !url.startsWith('wss:')) {
        console.warn('[Socket] Production build detected but non-WSS URL provided. Upgrading...');
        return url.replace(/^http:/, 'https:').replace(/^ws:/, 'wss:');
    }
    if (url.includes('localhost') || url.includes('127.0.0.1')) return url;
    return url.replace(/^http:/, 'https:').replace(/^ws:/, 'wss:');
};

/**
 * Frost Socket Client
 *
 * MISSION-CRITICAL: Strictly typed, environment-driven, and telemetry-enabled.
 * Enforces canonical event contract at compile time.
 */
class FrostSocketClient {
    private socket: SocketIOClient<ServerToClientEvents, ClientToServerEvents> | null = null;
    private listeners: Map<string, Set<Function>> = new Map();

    /**
     * Connect to a specific Frost namespace
     */
    public connect(namespace: '/agents' | '/supervisors' | '/admin', providedToken?: string) {
        if (this.socket) {
            console.log('[Socket] Cleaning up previous instance...');
            this.socket.disconnect();
            this.socket.removeAllListeners();
        }

        const { setStatus, setSocketId, setLastError, showToast } = useSocketStore.getState();
        const { logout, token: storeToken } = useAuthStore.getState();

        const token = providedToken || storeToken;

        if (!token) {
            console.error('[Socket] No authentication token available');
            setStatus('ERROR');
            setLastError('No authentication token');
            return;
        }

        const rawUrl = getFinalUrl(SOCKET_URL);
        const baseUrl = rawUrl.replace(/\/$/, '');
        const ns = namespace.startsWith('/') ? namespace : `/${namespace}`;
        const connectionUrl = `${baseUrl}${ns}`;

        console.log(`[Socket] 📡 INITIATING CONNECTION to ${ns} (URL: ${baseUrl})`);
        setStatus('CONNECTING');

        // Initializing with strictly typed events
        this.socket = io(connectionUrl, {
            auth: { token },
            transports: ['websocket'], // FORCE WEBSOCKET ONLY (No polling)
            upgrade: false, // Already on websocket
            secure: true,   // Allow WSS
            rejectUnauthorized: false, // Self-signed certs in dev (remove for strict prod if needed, but safe here)
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            forceNew: true,
        });

        this.socket.on('connect', () => {
            console.log(`[Socket] ✅ CONNECTED on session ${this.socket?.id}`);
            setStatus('CONNECTED');
            setSocketId(this.socket?.id || null);
            setLastError(null);
        });

        this.socket.on('connect_error', (error) => {
            console.error(`[Socket] 🛑 HANDSHAKE FAILED: ${error.message}`);

            if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
                console.warn('[Socket] ❌ AUTH DENIED. Purging session...');
                logout();
                setStatus('ERROR');
                setLastError('Authentication Denied');
                return;
            }

            setStatus('ERROR');
            setLastError(error.message);
        });

        this.socket.on('disconnect', (reason) => {
            console.warn(`[Socket] ❌ LINK LOST: ${reason}`);
            setStatus('DISCONNECTED');
            setSocketId(null);
        });

        // Lifecycle Telemetry (typed internally)
        const manager = (this.socket as any).io;
        manager.on('reconnect_attempt', (attempt: number) => {
            console.warn(`[Socket] 🔄 RECONNECTING (Attempt ${attempt})...`);
            setStatus('CONNECTING');
        });

        manager.on('reconnect_failed', () => {
            console.error('[Socket] 💀 FATAL: Reconnection failed');
            setStatus('ERROR');
            showToast('Connection failed permanently', 'error');
        });

        // Re-attach all registered listeners
        this.listeners.forEach((set, event) => {
            set.forEach(cb => this.socket?.on(event as any, cb as any));
        });

        return this.socket;
    }

    /**
     * Resilient, strictly-typed emit
     */
    public emit<E extends keyof ClientToServerEvents>(
        event: E,
        ...args: Parameters<ClientToServerEvents[E]>
    ) {
        if (!this.socket?.connected) {
            console.warn(`[Socket] Cannot emit "${String(event)}" - NOT CONNECTED`);
            return false;
        }
        // Properly type the emit call
        this.socket.emit(event as any, ...args as any);
        return true;
    }

    /**
     * Strictly-typed event listener registration
     */
    public on<E extends keyof ServerToClientEvents>(
        event: E,
        callback: ServerToClientEvents[E]
    ) {
        if (!this.listeners.has(event as string)) {
            this.listeners.set(event as string, new Set());
        }
        this.listeners.get(event as string)!.add(callback);
        this.socket?.on(event as any, callback as any);
        return () => this.off(event, callback);
    }

    public off<E extends keyof ServerToClientEvents>(
        event: E,
        callback: ServerToClientEvents[E]
    ) {
        this.listeners.get(event as string)?.delete(callback);
        this.socket?.off(event as any, callback as any);
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public get isConnected() {
        return this.socket?.connected ?? false;
    }

    public get id() {
        return this.socket?.id;
    }
}

export const frostSocket = new FrostSocketClient();
