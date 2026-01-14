"use strict";
/**
 * Example: Updated TelephonyService using Dependency Injection
 *
 * Instead of calling SocketService.getInstance(), we inject TypedEmitter
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelephonyService = void 0;
class TelephonyService {
    static instance;
    emitter;
    regionGateways = {
        'EG': 'SIP_TRUNK_EG_01',
        'AE': 'SIP_TRUNK_AE_01',
        'SA': 'STC_TRUNK_SA_01',
        'default': 'TWILIO_GLOBAL'
    };
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TelephonyService();
        }
        return this.instance;
    }
    /**
     * NEW: Inject the emitter (called from server.ts on startup)
     */
    setEmitter(emitter) {
        this.emitter = emitter;
    }
    async initiateCall(config) {
        const gateway = this.regionGateways[config.region] || this.regionGateways['default'];
        console.log(`[Telephony] Routing call to ${config.to} via ${gateway} for Agent ${config.agentId}`);
        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        // Simulate async carrier response
        this.simulateCarrierEvents(callId, config);
        return callId;
    }
    simulateCarrierEvents(callId, config) {
        if (!this.emitter) {
            console.error('[Telephony] Emitter not initialized!');
            return;
        }
        // 1. Ringing
        setTimeout(() => {
            console.log(`[Telephony] Call ${callId} RINGING`);
            this.emitter.toAgent(config.agentId).emitIncoming({
                v: 1,
                callId,
                direction: 'OUTBOUND',
                customerNumber: config.to
            });
        }, 500);
        // 2. Answered
        setTimeout(() => {
            console.log(`[Telephony] Call ${callId} ANSWERED`);
            this.emitter.toAgent(config.agentId).emitBridged({
                v: 1,
                callId,
                leadId: config.leadId,
                leadData: { name: 'Simulated Customer', phone: config.to },
                campaignName: 'Outbound Sales',
                scriptBody: '# Welcome\nHello, I am calling from...',
                connectedAt: Date.now()
            });
        }, 2500);
    }
    async terminateCall(callId) {
        console.log(`[Telephony] Terminating call ${callId}`);
    }
}
exports.TelephonyService = TelephonyService;
