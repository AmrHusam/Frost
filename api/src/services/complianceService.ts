import fs from 'fs';
import path from 'path';

export interface ComplianceContext {
    region: string;
    phoneNumber: string;
    leadId: string;
    agentId: string;
}

export interface ComplianceVerdict {
    status: 'ALLOW' | 'DENY';
    reasons: string[];
}

export class ComplianceService {
    private static instance: ComplianceService;

    // Mock In-Memory DNC List
    private dncList = new Set(['+971509999999', '+201299999999']);

    private constructor() { }

    static getInstance(): ComplianceService {
        if (!this.instance) {
            this.instance = new ComplianceService();
        }
        return this.instance;
    }

    /**
     * Evaluates a call request against strict regulatory policies.
     */
    public async evaluate(ctx: ComplianceContext): Promise<ComplianceVerdict> {
        const reasons: string[] = [];
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

        return { status: verdict as 'ALLOW' | 'DENY', reasons };
    }

    private checkTimeWindow(region: string): boolean {
        const now = new Date();
        const utcHour = now.getUTCHours();

        // Simple mock offsets
        let localHour = utcHour;
        if (region === 'EG') localHour = utcHour + 2;
        if (region === 'SA') localHour = utcHour + 3;
        if (region === 'AE') localHour = utcHour + 4;

        // Rule: 09:00 to 18:00 Local
        return localHour >= 9 && localHour < 20; // Extended for demo
    }

    private checkConsent(leadId: string): boolean {
        // In prod, check DB for valid consent token
        return true;
    }

    private async logAudit(ctx: ComplianceContext, status: string, reasons: string[]) {
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
