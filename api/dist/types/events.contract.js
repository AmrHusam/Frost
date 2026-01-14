"use strict";
/**
 * Socket.IO Event Contract v1.0 - Production Ready
 *
 * AUTHORITATIVE CONTRACT for Real-Time Call Center Dialer
 *
 * This contract is the single source of truth for all Socket.IO events.
 * Frontend and backend teams must implement exactly as specified.
 *
 * VERSIONING STRATEGY:
 * - Payload versioning: Each payload includes `v: number`
 * - Backward compatibility: Server supports v1 and v2 simultaneously for 6 months
 * - Breaking changes: Increment version, deprecate old version with timeline
 *
 * NAMING CONVENTIONS:
 * - Format: `resource.action` (e.g., `call.incoming`, `agent.statusChanged`)
 * - Client→Server: Command style (imperative: `call.accept`, `agent.login`)
 * - Server→Client: Event style (past tense: `call.bridged`, `agent.loggedIn`)
 * - No abbreviations: Use full words for clarity
 *
 * NAMESPACE STRATEGY:
 * - /agents: Agent clients only (role: AGENT)
 * - /supervisors: Supervisor clients only (role: SUPERVISOR, ADMIN)
 * - /admin: Admin clients only (role: ADMIN)
 *
 * ROOM STRATEGY:
 * - user:{userId}: Personal room for targeted messaging
 * - call:{callId}: Ephemeral room for active calls
 * - campaign:{campaignId}: Campaign-level broadcasts
 */
Object.defineProperty(exports, "__esModule", { value: true });
