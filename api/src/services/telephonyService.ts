import { TypedEmitter } from '../socket/services/TypedEmitter';

interface CallConfig {
    to: string;
    from?: string; // Optional override
    region: string;
    agentId: string;
    leadId: string;
}

export class TelephonyService {
    private static instance: TelephonyService;
    private emitter?: TypedEmitter;

    // Regional Gateway Configuration (Mock)
    private regionGateways: Record<string, string> = {
        'EG': 'SIP_TRUNK_EG_01',
        'AE': 'SIP_TRUNK_AE_01', // UAE
        'SA': 'STC_TRUNK_SA_01', // KSA
        'default': 'TWILIO_GLOBAL'
    };

    private constructor() { }

    static getInstance(): TelephonyService {
        if (!this.instance) {
            this.instance = new TelephonyService();
        }
        return this.instance;
    }

    /**
     * Inject the TypedEmitter for event emission
     * Called from server.ts after SocketManager initialization
     */
    public setEmitter(emitter: TypedEmitter): void {
        this.emitter = emitter;
    }

    /**
     * Initiates an outbound call via the appropriate regional gateway.
     */
    public async initiateCall(config: CallConfig): Promise<string> {
        const gateway = this.regionGateways[config.region] || this.regionGateways['default'];
        console.log(`[Telephony] Routing call to ${config.to} via ${gateway} for Agent ${config.agentId}`);

        // Mock Carrier API Interaction
        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        // Simulate async carrier response and signaling
        this.simulateCarrierEvents(callId, config);

        return callId;
    }

    /**
     * Simulates the lifecycle events from the carrier (Ringing, Answer, Hangup)
     * In prod, this would be a Webhook handler.
     */
    private simulateCarrierEvents(callId: string, config: CallConfig) {
        if (!this.emitter) {
            console.error('[Telephony] ERROR: TypedEmitter not injected. Call setEmitter() first.');
            return;
        }

        // 1. Ringing (Immediate)
        setTimeout(() => {
            console.log(`[Telephony] Call ${callId} RINGING`);
            this.emitter!.toAgent(config.agentId).emitAssigned({
                v: 1,
                callId,
                direction: 'OUTBOUND',
                customerNumber: config.to,
                campaignId: 'campaign_123',
                campaignName: 'Outbound Sales',
                priority: 5
            });
        }, 500);

        // 2. Client Answer (Simulated 2s later)
        setTimeout(() => {
            console.log(`[Telephony] Call ${callId} ANSWERED`);
            // Trigger Screen Pop
            this.emitter!.toAgent(config.agentId).emitBridged({
                v: 1,
                callId,
                bridgedAt: Date.now(),
                leadData: {
                    id: config.leadId,
                    name: 'Simulated Customer',
                    phone: config.to
                },
                scriptBody: '# Welcome\nHello, I am calling from...',
                complianceFlags: {
                    dncCheck: true,
                    consentVerified: false,
                    recordingEnabled: false
                }
            });
        }, 2500);
    }

    public async terminateCall(callId: string): Promise<void> {
        console.log(`[Telephony] Terminating call ${callId}`);
        // Mock Provider Hangup
    }
}
