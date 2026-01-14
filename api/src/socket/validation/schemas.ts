/**
 * Zod Validation Schemas
 * 
 * Runtime validation for all inbound Socket.IO events.
 * These schemas enforce the event contract at runtime.
 * 
 * CRITICAL: Every client→server event MUST have a schema.
 * Invalid payloads are rejected before reaching business logic.
 */

import { z } from 'zod';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

const BasePayloadSchema = z.object({
    v: z.number().int().positive(),
    timestamp: z.number().optional(),
    eventId: z.string().uuid().optional()
});

// ============================================================================
// AGENT LIFECYCLE SCHEMAS
// ============================================================================

export const AgentLoginSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    campaignIds: z.array(z.string().uuid()).optional(),
    skills: z.array(z.string()).optional()
});

export const AgentSetStatusSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    status: z.enum(['OFFLINE', 'READY', 'NOT_READY', 'RINGING', 'ON_CALL', 'WRAP_UP', 'BREAK']),
    reason: z.string().max(200).optional()
});

export const AgentStartBreakSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    breakType: z.enum(['LUNCH', 'TRAINING', 'MEETING', 'PERSONAL', 'SYSTEM']),
    estimatedDuration: z.number().int().positive().optional(),
    reason: z.string().max(200).optional()
});

export const AgentEndBreakSchema = BasePayloadSchema.extend({
    v: z.literal(1)
});

export const AgentLogoutSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    reason: z.string().max(200).optional()
});

// ============================================================================
// CALL LIFECYCLE SCHEMAS
// ============================================================================

export const CallAcceptSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid()
});

export const CallRejectSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid(),
    reason: z.enum(['BUSY', 'NOT_READY', 'TECHNICAL_ISSUE', 'OTHER']),
    notes: z.string().max(500).optional()
});

export const CallInitiateSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    customerNumber: z.string().min(5).max(20),
    campaignId: z.string().uuid().optional()
});

export const CallHoldSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid(),
    reason: z.string().max(200).optional()
});

export const CallResumeSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid()
});

export const CallTransferSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid(),
    transferType: z.enum(['WARM', 'COLD', 'CONFERENCE']),
    targetAgentId: z.string().uuid().optional(),
    targetQueueId: z.string().uuid().optional(),
    notes: z.string().max(500).optional()
});

export const CallHangupSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid(),
    reason: z.string().max(200).optional()
});

export const CallDispositionSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid(),
    dispositionCode: z.string().min(1).max(50),
    notes: z.string().max(1000).optional(),
    scheduleCallback: z.object({
        scheduledAt: z.number().int().positive(),
        reason: z.string().max(200)
    }).optional(),
    customFields: z.record(z.unknown()).optional()
});

// ============================================================================
// COMPLIANCE SCHEMAS
// ============================================================================

export const ReportViolationSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid().optional(),
    violationType: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
});

export const RequestConsentSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid(),
    consentType: z.enum(['RECORDING', 'DATA_PROCESSING', 'MARKETING'])
});

// ============================================================================
// SUPERVISOR SCHEMAS
// ============================================================================

export const SupervisorMonitorCallSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid()
});

export const SupervisorStopMonitoringSchema = BasePayloadSchema.extend({
    v: z.literal(1),
    callId: z.string().uuid()
});

// ============================================================================
// VALIDATION HELPER
// ============================================================================

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: z.ZodError;
    };
}

/**
 * Validate payload against schema
 * Returns structured result with error details
 */
export function validatePayload<T>(
    schema: z.ZodSchema<T>,
    payload: unknown
): ValidationResult<T> {
    const result = schema.safeParse(payload);

    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    } else {
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
export function isValidationSuccess<T>(
    result: ValidationResult<T>
): result is { success: true; data: T } {
    return result.success === true;
}
