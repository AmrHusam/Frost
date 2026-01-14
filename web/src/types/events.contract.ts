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

// ============================================================================
// BASE TYPES & UTILITIES
// ============================================================================

export type EventVersion = 1 | 2;

export interface BasePayload {
    v: EventVersion;
    timestamp?: number;
    eventId?: string; // For idempotency tracking
}

export type AckCallback<T> = (response: T) => void;

export interface StandardResponse {
    success: boolean;
    error?: {
        code: string;
        message: string;
    };
}

// ============================================================================
// AGENT LIFECYCLE EVENTS
// ============================================================================

export interface AgentLifecycleEvents {
    // Client → Server
    "agent.login": (data: AgentLoginPayload, ack: AckCallback<AgentLoginResponse>) => void;
    "agent.setStatus": (data: AgentSetStatusPayload, ack: AckCallback<AgentStatusResponse>) => void;
    "agent.startBreak": (data: AgentStartBreakPayload, ack: AckCallback<AgentStatusResponse>) => void;
    "agent.endBreak": (data: AgentEndBreakPayload, ack: AckCallback<AgentStatusResponse>) => void;
    "agent.logout": (data: AgentLogoutPayload, ack: AckCallback<StandardResponse>) => void;

    // Server → Client
    "agent.loggedIn": (data: AgentLoggedInPayload) => void;
    "agent.statusChanged": (data: AgentStatusChangedPayload) => void;
    "agent.breakStarted": (data: AgentBreakStartedPayload) => void;
    "agent.breakEnded": (data: AgentBreakEndedPayload) => void;
    "agent.loggedOut": (data: AgentLoggedOutPayload) => void;
    "agent.statsUpdated": (data: AgentStatsPayload) => void;
    "agent.forceLogout": (data: AgentForceLogoutPayload) => void;
}

export type AgentStatus =
    | "OFFLINE"     // Not logged in
    | "READY"       // Available for calls
    | "NOT_READY"   // Logged in but unavailable
    | "RINGING"     // Incoming call
    | "ON_CALL"     // Active call
    | "WRAP_UP"     // Post-call work
    | "BREAK";      // On break

export type BreakType = "LUNCH" | "TRAINING" | "MEETING" | "PERSONAL" | "SYSTEM";

export interface AgentLoginPayload extends BasePayload {
    v: 1;
    campaignIds?: string[]; // Optional: campaigns to join
    skills?: string[];      // Optional: agent skills
}

export interface AgentLoginResponse extends StandardResponse {
    sessionId?: string;
    assignedCampaigns?: string[];
    initialStatus?: AgentStatus;
}

export interface AgentSetStatusPayload extends BasePayload {
    v: 1;
    status: AgentStatus;
    reason?: string;
}

export interface AgentStartBreakPayload extends BasePayload {
    v: 1;
    breakType: BreakType;
    estimatedDuration?: number; // seconds
    reason?: string;
}

export interface AgentEndBreakPayload extends BasePayload {
    v: 1;
}

export interface AgentLogoutPayload extends BasePayload {
    v: 1;
    reason?: string;
}

export interface AgentLoggedInPayload extends BasePayload {
    v: 1;
    agentId: string;
    status: AgentStatus;
    sessionId: string;
    campaigns: string[];
}

export interface AgentStatusChangedPayload extends BasePayload {
    v: 1;
    agentId: string;
    previousStatus: AgentStatus;
    currentStatus: AgentStatus;
    changedAt: number;
    reason?: string;
}

export interface AgentBreakStartedPayload extends BasePayload {
    v: 1;
    breakType: BreakType;
    startedAt: number;
    estimatedEndAt?: number;
}

export interface AgentBreakEndedPayload extends BasePayload {
    v: 1;
    breakType: BreakType;
    duration: number; // actual duration in seconds
}

export interface AgentLoggedOutPayload extends BasePayload {
    v: 1;
    reason?: string;
    loggedOutAt: number;
}

export interface AgentStatsPayload extends BasePayload {
    v: 1;
    callsHandled: number;
    callsAccepted: number;
    callsRejected: number;
    avgHandleTime: number;    // seconds
    avgTalkTime: number;       // seconds
    avgWrapTime: number;       // seconds
    idleTime: number;          // seconds
    utilizationRate: number;   // percentage (0-100)
}

export interface AgentForceLogoutPayload extends BasePayload {
    v: 1;
    reason: "DUPLICATE_SESSION" | "ADMIN_ACTION" | "POLICY_VIOLATION" | "SYSTEM_MAINTENANCE";
    message: string;
    gracePeriod?: number; // seconds before disconnect
}

export interface AgentStatusResponse extends StandardResponse {
    newStatus?: AgentStatus;
    effectiveAt?: number;
}

// ============================================================================
// CALL LIFECYCLE EVENTS
// ============================================================================

export interface CallLifecycleEvents {
    // Server → Client
    "call.assigned": (data: CallAssignedPayload) => void;
    "call.ringing": (data: CallRingingPayload) => void;
    "call.bridged": (data: CallBridgedPayload) => void;
    "call.held": (data: CallHeldPayload) => void;
    "call.resumed": (data: CallResumedPayload) => void;
    "call.transferred": (data: CallTransferredPayload) => void;
    "call.ended": (data: CallEndedPayload) => void;
    "call.failed": (data: CallFailedPayload) => void;

    // Client → Server
    "call.accept": (data: CallAcceptPayload, ack: AckCallback<CallActionResponse>) => void;
    "call.reject": (data: CallRejectPayload, ack: AckCallback<CallActionResponse>) => void;
    "call.initiate": (data: CallInitiatePayload, ack: AckCallback<CallActionResponse>) => void;
    "call.hold": (data: CallHoldPayload, ack: AckCallback<CallActionResponse>) => void;
    "call.resume": (data: CallResumePayload, ack: AckCallback<CallActionResponse>) => void;
    "call.transfer": (data: CallTransferPayload, ack: AckCallback<CallActionResponse>) => void;
    "call.hangup": (data: CallHangupPayload, ack: AckCallback<CallActionResponse>) => void;
    "call.submitDisposition": (data: CallDispositionPayload, ack: AckCallback<StandardResponse>) => void;
}

export type CallDirection = "INBOUND" | "OUTBOUND";
export type CallEndReason = "COMPLETED" | "NO_ANSWER" | "BUSY" | "FAILED" | "REJECTED" | "TRANSFERRED";
export type TransferType = "WARM" | "COLD" | "CONFERENCE";

export interface CallAssignedPayload extends BasePayload {
    v: 1;
    callId: string;
    direction: CallDirection;
    customerNumber: string;
    customerName?: string;
    campaignId: string;
    campaignName: string;
    leadId?: string;
    priority: number; // 1-10, higher = more urgent
    metadata?: Record<string, unknown>;
}

export interface CallRingingPayload extends BasePayload {
    v: 1;
    callId: string;
    ringingAt: number;
}

export interface CallBridgedPayload extends BasePayload {
    v: 1;
    callId: string;
    bridgedAt: number;
    leadData?: {
        id: string;
        name: string;
        phone: string;
        email?: string;
        address?: string;
        customFields?: Record<string, unknown>;
    };
    scriptBody?: string;
    scriptVersion?: string;
    complianceFlags?: {
        dncCheck: boolean;
        consentVerified: boolean;
        recordingEnabled: boolean;
    };
}

export interface CallHeldPayload extends BasePayload {
    v: 1;
    callId: string;
    heldAt: number;
    reason?: string;
}

export interface CallResumedPayload extends BasePayload {
    v: 1;
    callId: string;
    resumedAt: number;
    holdDuration: number; // seconds
}

export interface CallTransferredPayload extends BasePayload {
    v: 1;
    callId: string;
    transferType: TransferType;
    targetAgentId?: string;
    targetAgentName?: string;
    transferredAt: number;
}

export interface CallEndedPayload extends BasePayload {
    v: 1;
    callId: string;
    endedAt: number;
    duration: number;        // total call duration in seconds
    talkTime: number;        // actual talk time (excluding hold)
    holdTime: number;        // total hold time
    endedBy: "AGENT" | "CUSTOMER" | "SYSTEM";
    reason: CallEndReason;
    dispositionRequired: boolean;
    wrapUpTime?: number;     // allocated wrap-up time in seconds
}

export interface CallFailedPayload extends BasePayload {
    v: 1;
    callId: string;
    failedAt: number;
    errorCode: string;
    errorMessage: string;
    recoverable: boolean;
}

export interface CallAcceptPayload extends BasePayload {
    v: 1;
    callId: string;
}

export interface CallRejectPayload extends BasePayload {
    v: 1;
    callId: string;
    reason: "BUSY" | "NOT_READY" | "TECHNICAL_ISSUE" | "OTHER";
    notes?: string;
}

export interface CallHoldPayload extends BasePayload {
    v: 1;
    callId: string;
    reason?: string;
}

export interface CallResumePayload extends BasePayload {
    v: 1;
    callId: string;
}

export interface CallTransferPayload extends BasePayload {
    v: 1;
    callId: string;
    transferType: TransferType;
    targetAgentId?: string;
    targetQueueId?: string;
    notes?: string;
}

export interface CallHangupPayload extends BasePayload {
    v: 1;
    callId: string;
    reason?: string;
}

export interface CallInitiatePayload extends BasePayload {
    v: 1;
    customerNumber: string;
    campaignId?: string;
}

export interface CallDispositionPayload extends BasePayload {
    v: 1;
    callId: string;
    dispositionCode: string;
    notes?: string;
    scheduleCallback?: {
        scheduledAt: number;
        reason: string;
    };
    customFields?: Record<string, unknown>;
}

export interface CallActionResponse extends StandardResponse {
    callId?: string;
    newState?: string;
}

// ============================================================================
// COMPLIANCE EVENTS
// ============================================================================

export interface ComplianceEvents {
    // Server → Client
    "compliance.dncViolation": (data: DncViolationPayload) => void;
    "compliance.consentRequired": (data: ConsentRequiredPayload) => void;
    "compliance.recordingStarted": (data: RecordingStartedPayload) => void;
    "compliance.recordingStopped": (data: RecordingStoppedPayload) => void;
    "compliance.callTimeViolation": (data: CallTimeViolationPayload) => void;

    // Client → Server
    "compliance.reportViolation": (data: ReportViolationPayload, ack: AckCallback<StandardResponse>) => void;
    "compliance.requestConsent": (data: RequestConsentPayload, ack: AckCallback<ConsentResponse>) => void;
}

export interface DncViolationPayload extends BasePayload {
    v: 1;
    callId: string;
    phoneNumber: string;
    listType: "FEDERAL" | "STATE" | "INTERNAL" | "COMPANY";
    action: "CALL_BLOCKED" | "CALL_TERMINATED";
    detectedAt: number;
}

export interface ConsentRequiredPayload extends BasePayload {
    v: 1;
    callId: string;
    consentType: "RECORDING" | "DATA_PROCESSING" | "MARKETING";
    required: boolean;
    scriptText?: string;
}

export interface RecordingStartedPayload extends BasePayload {
    v: 1;
    callId: string;
    recordingId: string;
    startedAt: number;
    consentObtained: boolean;
}

export interface RecordingStoppedPayload extends BasePayload {
    v: 1;
    callId: string;
    recordingId: string;
    stoppedAt: number;
    duration: number;
    storageLocation?: string;
}

export interface CallTimeViolationPayload extends BasePayload {
    v: 1;
    callId: string;
    violationType: "TOO_EARLY" | "TOO_LATE" | "WEEKEND" | "HOLIDAY";
    localTime: string;
    timezone: string;
    action: "WARNING" | "CALL_BLOCKED";
}

export interface ReportViolationPayload extends BasePayload {
    v: 1;
    callId?: string;
    violationType: string;
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface RequestConsentPayload extends BasePayload {
    v: 1;
    callId: string;
    consentType: "RECORDING" | "DATA_PROCESSING" | "MARKETING";
}

export interface ConsentResponse extends StandardResponse {
    consentGranted?: boolean;
    recordedAt?: number;
}

// ============================================================================
// SYSTEM & ERROR EVENTS
// ============================================================================

export interface SystemEvents {
    // Server → Client
    "system.notification": (data: SystemNotificationPayload) => void;
    "system.maintenance": (data: SystemMaintenancePayload) => void;
    "system.error": (data: SystemErrorPayload) => void;
    "system.configUpdated": (data: ConfigUpdatedPayload) => void;

    // Bidirectional (Monitoring)
    "presence.ping": (timestamp: number) => void;
    "presence.pong": (timestamp: number) => void;
}

export type NotificationSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface SystemNotificationPayload extends BasePayload {
    v: 1;
    severity: NotificationSeverity;
    title: string;
    message: string;
    actionUrl?: string;
    expiresAt?: number;
}

export interface SystemMaintenancePayload extends BasePayload {
    v: 1;
    scheduledAt: number;
    estimatedDuration: number; // seconds
    message: string;
    affectedServices?: string[];
}

export interface SystemErrorPayload extends BasePayload {
    v: 1;
    code: string;
    message: string;
    recoverable: boolean;
    retryAfter?: number; // seconds
    context?: Record<string, unknown>;
}

export interface ConfigUpdatedPayload extends BasePayload {
    v: 1;
    configKey: string;
    effectiveAt: number;
    requiresReload: boolean;
}

// ============================================================================
// CONNECTION LIFECYCLE
// ============================================================================

export interface ConnectionEvents {
    // Server → Client
    "connection.ready": (data: ConnectionReadyPayload) => void;
    "connection.error": (data: ConnectionErrorPayload) => void;
}

export interface ConnectionReadyPayload extends BasePayload {
    v: 1;
    clientId: string;
    serverTime: number;
    serverVersion: string;
    capabilities: string[];
}

export interface ConnectionErrorPayload extends BasePayload {
    v: 1;
    code: "AUTH_FAILED" | "RATE_LIMIT" | "SERVER_ERROR" | "VERSION_MISMATCH";
    message: string;
    fatal: boolean;
}

// ============================================================================
// COMBINED EVENT MAPS (For Socket.IO Typing)
// ============================================================================

export interface ServerToClientEvents
    extends ConnectionEvents,
    AgentLifecycleEvents,
    CallLifecycleEvents,
    ComplianceEvents,
    SystemEvents { }

export interface ClientToServerEvents
    extends AgentLifecycleEvents,
    CallLifecycleEvents,
    ComplianceEvents,
    SystemEvents { }

// ============================================================================
// NAMESPACE-SPECIFIC TYPES
// ============================================================================

export interface AgentNamespaceEvents extends ServerToClientEvents, ClientToServerEvents { }
export interface SupervisorNamespaceEvents {
    // Supervisors can monitor but not control calls
    "supervisor.monitorCall": (data: { callId: string }, ack: AckCallback<StandardResponse>) => void;
    "supervisor.stopMonitoring": (data: { callId: string }, ack: AckCallback<StandardResponse>) => void;
    "supervisor.agentStatusUpdate": (data: AgentStatusChangedPayload) => void;
    "supervisor.callUpdate": (data: CallBridgedPayload | CallEndedPayload) => void;
}

// ============================================================================
// DEPRECATION TRACKING
// ============================================================================

/**
 * @deprecated Use `call.assigned` instead. Will be removed in v2.0 (2026-06-01)
 */
export interface LegacyCallAssignPayload {
    callId: string;
    status: string;
}
