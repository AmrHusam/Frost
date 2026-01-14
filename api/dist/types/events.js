"use strict";
/**
 * Socket.IO Event Contract v1.0
 *
 * This file defines the complete event contract for the Real-Time Dialer system.
 *
 * VERSIONING STRATEGY:
 * - Payload versioning: Each event payload includes a `v` field
 * - Backward compatibility: Server supports v1 and v2 simultaneously
 * - Deprecation: Mark events as @deprecated, remove after 6 months
 *
 * NAMING CONVENTIONS:
 * - Format: `resource.action` (e.g., `call.incoming`)
 * - Client→Server: Command style (`call.accept`, `agent.setStatus`)
 * - Server→Client: Event style (`call.bridged`, `agent.statusChanged`)
 */
Object.defineProperty(exports, "__esModule", { value: true });
