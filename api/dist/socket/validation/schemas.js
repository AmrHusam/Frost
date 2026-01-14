"use strict";
/**
 * Zod Validation Schemas
 *
 * Runtime validation for all inbound Socket.IO events.
 * These schemas enforce the event contract at runtime.
 *
 * CRITICAL: Every client→server event MUST have a schema.
 * Invalid payloads are rejected before reaching business logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupervisorStopMonitoringSchema = exports.SupervisorMonitorCallSchema = exports.RequestConsentSchema = exports.ReportViolationSchema = exports.CallDispositionSchema = exports.CallHangupSchema = exports.CallTransferSchema = exports.CallResumeSchema = exports.CallHoldSchema = exports.CallRejectSchema = exports.CallAcceptSchema = exports.AgentLogoutSchema = exports.AgentEndBreakSchema = exports.AgentStartBreakSchema = exports.AgentSetStatusSchema = exports.AgentLoginSchema = void 0;
exports.validatePayload = validatePayload;
exports.isValidationSuccess = isValidationSuccess;
const zod_1 = require("zod");
// ============================================================================
// BASE SCHEMAS
// ============================================================================
const BasePayloadSchema = zod_1.z.object({
    v: zod_1.z.number().int().positive(),
    timestamp: zod_1.z.number().optional(),
    eventId: zod_1.z.string().uuid().optional()
});
// ============================================================================
// AGENT LIFECYCLE SCHEMAS
// ============================================================================
exports.AgentLoginSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    campaignIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional()
});
exports.AgentSetStatusSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    status: zod_1.z.enum(['OFFLINE', 'READY', 'NOT_READY', 'RINGING', 'ON_CALL', 'WRAP_UP', 'BREAK']),
    reason: zod_1.z.string().max(200).optional()
});
exports.AgentStartBreakSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    breakType: zod_1.z.enum(['LUNCH', 'TRAINING', 'MEETING', 'PERSONAL', 'SYSTEM']),
    estimatedDuration: zod_1.z.number().int().positive().optional(),
    reason: zod_1.z.string().max(200).optional()
});
exports.AgentEndBreakSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1)
});
exports.AgentLogoutSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    reason: zod_1.z.string().max(200).optional()
});
// ============================================================================
// CALL LIFECYCLE SCHEMAS
// ============================================================================
exports.CallAcceptSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid()
});
exports.CallRejectSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid(),
    reason: zod_1.z.enum(['BUSY', 'NOT_READY', 'TECHNICAL_ISSUE', 'OTHER']),
    notes: zod_1.z.string().max(500).optional()
});
exports.CallHoldSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().max(200).optional()
});
exports.CallResumeSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid()
});
exports.CallTransferSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid(),
    transferType: zod_1.z.enum(['WARM', 'COLD', 'CONFERENCE']),
    targetAgentId: zod_1.z.string().uuid().optional(),
    targetQueueId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(500).optional()
});
exports.CallHangupSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().max(200).optional()
});
exports.CallDispositionSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid(),
    dispositionCode: zod_1.z.string().min(1).max(50),
    notes: zod_1.z.string().max(1000).optional(),
    scheduleCallback: zod_1.z.object({
        scheduledAt: zod_1.z.number().int().positive(),
        reason: zod_1.z.string().max(200)
    }).optional(),
    customFields: zod_1.z.record(zod_1.z.unknown()).optional()
});
// ============================================================================
// COMPLIANCE SCHEMAS
// ============================================================================
exports.ReportViolationSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid().optional(),
    violationType: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(1000),
    severity: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
});
exports.RequestConsentSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid(),
    consentType: zod_1.z.enum(['RECORDING', 'DATA_PROCESSING', 'MARKETING'])
});
// ============================================================================
// SUPERVISOR SCHEMAS
// ============================================================================
exports.SupervisorMonitorCallSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid()
});
exports.SupervisorStopMonitoringSchema = BasePayloadSchema.extend({
    v: zod_1.z.literal(1),
    callId: zod_1.z.string().uuid()
});
/**
 * Validate payload against schema
 * Returns structured result with error details
 */
function validatePayload(schema, payload) {
    const result = schema.safeParse(payload);
    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    }
    else {
        return {
            success: false,
            error: {
                code: 'INVALID_PAYLOAD',
                message: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
                details: result.error
            }
        };
    }
}
/**
 * Type guard for validation result
 */
function isValidationSuccess(result) {
    return result.success === true;
}
