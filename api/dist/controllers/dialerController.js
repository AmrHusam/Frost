"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitDisposition = exports.initiateManualCall = void 0;
// In a real implementation, this would import the shared Compliance Engine or call a microservice
// For this single-repo demo, we mimic the logic.
const initiateManualCall = async (req, res) => {
    const { phoneNumber, leadId, campaignId } = req.body;
    const agent = req.user;
    // 1. Compliance Check (Mock)
    // In prod: await complianceService.evaluate(phoneNumber, 'EG');
    const isCompliant = true;
    if (!isCompliant) {
        // Log blocked attempt
        console.warn(`Blocked call to ${phoneNumber} by Agent ${agent.id}`);
        return res.status(451).json({
            error: 'Compliance Block',
            reason: 'DNC_MATCH',
            action: 'Call Blocked by System'
        });
    }
    // 2. Telephony Initiation
    // Mocking Carrier API call
    console.log(`Dialing ${phoneNumber} via Twilio for Agent ${agent.id}...`);
    // 3. Return Call Object
    return res.status(201).json({
        callId: 'call_' + Date.now(),
        status: 'RINGING',
        target: phoneNumber,
        initiatedAt: new Date(),
    });
};
exports.initiateManualCall = initiateManualCall;
const submitDisposition = async (req, res) => {
    const { callId, disposition, notes, dncRequested } = req.body;
    // 1. Log Outcome to CRM
    console.log(`Call ${callId} ended with ${disposition}`);
    // 2. Handle Auto-Opt-Out
    if (dncRequested) {
        console.log(`Adding associated number to Global Suppression List...`);
        // await suppressionService.add(number, 'USER_REQUEST');
    }
    // 3. Release Agent
    return res.json({ success: true, nextState: 'READY' });
};
exports.submitDisposition = submitDisposition;
