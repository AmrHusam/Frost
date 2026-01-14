"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
class ComplianceService {
    static instance;
    // Mock In-Memory DNC List
    dncList = new Set(['+971509999999', '+201299999999']);
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ComplianceService();
        }
        return this.instance;
    }
    /**
     * Evaluates a call request against strict regulatory policies.
     */
    async evaluate(ctx) {
        const reasons = [];
        console.log(`[Compliance] Evaluating request for ${ctx.phoneNumber} in ${ctx.region}`);
        // 1. DNC Check (Global)
        if (this.dncList.has(ctx.phoneNumber)) {
            reasons.push('DNC_MATCH');
        }
        // 2. Time Window Check (Local Time)
        if (!this.checkTimeWindow(ctx.region)) {
            reasons.push('OUTSIDE_TIME_WINDOW');
        }
        // 3. Consent Check (Stub logic for SA)
        if (ctx.region === 'SA' && !this.checkConsent(ctx.leadId)) {
            reasons.push('MISSING_CONSENT');
        }
        const verdict = reasons.length === 0 ? 'ALLOW' : 'DENY';
        // 4. Audit Log (Immutable Write)
        await this.logAudit(ctx, verdict, reasons);
        return { status: verdict, reasons };
    }
    checkTimeWindow(region) {
        const now = new Date();
        const utcHour = now.getUTCHours();
        // Simple mock offsets
        let localHour = utcHour;
        if (region === 'EG')
            localHour = utcHour + 2;
        if (region === 'SA')
            localHour = utcHour + 3;
        if (region === 'AE')
            localHour = utcHour + 4;
        // Rule: 09:00 to 18:00 Local
        return localHour >= 9 && localHour < 20; // Extended for demo
    }
    checkConsent(leadId) {
        // In prod, check DB for valid consent token
        return true;
    }
    async logAudit(ctx, status, reasons) {
        // In prod: Write to S3 WORM or Append-Only DB
        const logEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            event_type: 'POLICY_EVALUATION',
            context: ctx,
            decision: status,
            reasons_blocked: reasons
        };
        console.log('[AUDIT_LOG]', JSON.stringify(logEntry));
    }
}
exports.ComplianceService = ComplianceService;
