"use strict";
/**
 * Socket.IO Authentication Middleware
 *
 * Validates JWT tokens during the handshake phase.
 * Rejects unauthorized connections before they complete.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
/**
 * Middleware to authenticate Socket.IO connections via JWT
 */
const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        // Verify JWT
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach user to socket.data
        socket.data.user = {
            id: decoded.id,
            role: decoded.role,
            name: decoded.name
        };
        next();
    }
    catch (err) {
        console.error(`❌ HANDSHAKE REJECTED: ${err.message}`);
        next(new Error(`Authentication error: ${err.message === 'jwt expired' ? 'Token expired' : 'Invalid token'}`));
    }
};
exports.authenticateSocket = authenticateSocket;
/**
 * Middleware to enforce role-based access
 */
const requireRole = (allowedRoles) => {
    return (socket, next) => {
        const userRole = socket.data.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return next(new Error('Authorization error: Insufficient permissions'));
        }
        next();
    };
};
exports.requireRole = requireRole;
