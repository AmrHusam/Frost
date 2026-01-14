/**
 * Socket.IO Authentication Middleware
 * 
 * Validates JWT tokens during the handshake phase.
 * Rejects unauthorized connections before they complete.
 */

import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface AuthenticatedUser {
    id: string;
    role: 'AGENT' | 'SUPERVISOR' | 'ADMIN';
    name: string;
}

export interface AuthenticatedSocket extends Socket {
    data: {
        user: AuthenticatedUser;
        latency?: number;
    };
}

/**
 * Middleware to authenticate Socket.IO connections via JWT
 */
export const authenticateSocket = async (
    socket: Socket,
    next: (err?: Error) => void
) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Attach user to socket.data
        socket.data.user = {
            id: decoded.id,
            role: decoded.role,
            name: decoded.name
        };

        next();
    } catch (err: any) {
        console.error(`❌ HANDSHAKE REJECTED: ${err.message}`);
        next(new Error(`Authentication error: ${err.message === 'jwt expired' ? 'Token expired' : 'Invalid token'}`));
    }
};

/**
 * Middleware to enforce role-based access
 */
export const requireRole = (allowedRoles: string[]) => {
    return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
        const userRole = socket.data.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return next(new Error('Authorization error: Insufficient permissions'));
        }

        next();
    };
};
