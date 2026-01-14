import { io } from 'socket.io-client';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

async function runSimulation() {
    console.log('🚀 Starting End-to-End System Validation...\n');

    // 1. Authentication
    console.log('[1] Authenticating Agent...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'agent@test.com', password: 'pass' })
    });

    if (!loginRes.ok) throw new Error('Login failed');
    const authData = await loginRes.json();
    const token = authData.token;
    const agentId = authData.user.id;
    console.log(`✅ Logged in as ${authData.user.name} (${agentId})`);

    // 2. WebSocket Connection
    console.log('\n[2] Connecting to Real-Time Gateway...');
    const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket']
    });

    await new Promise<void>((resolve) => {
        socket.on('connect', () => {
            console.log('✅ WebSocket Connected');
            resolve();
        });
    });

    // 3. Set Status READY
    console.log('\n[3] Setting Agent Status to READY...');
    socket.emit('agent:status', 'READY');
    console.log('✅ Status updated. Waiting for calls...');

    // 4. Initiate Call (Simulate "Click-to-Call" or Queue Pop)
    const targetPhone = '+971501234567'; // UAE Number
    const region = 'AE';

    console.log(`\n[4] Initiating Compliant Call to ${targetPhone} (${region})...`);

    // Setup Event Listeners for the Call
    const callPromise = new Promise<void>((resolve, reject) => {

        // A. Listen for Ringing
        socket.on('call.assign', (payload) => {
            console.log(`\n📞 [Event] Call Assigned (Ringing): ${payload.callId}`);
        });

        // B. Listen for Screen Pop (Bridged)
        socket.on('call.bridged', async (payload) => {
            console.log(`\n🗣️ [Event] Call Bridged! Screen Pop Triggered.`);
            console.log(`   - Customer: ${payload.leadData.name}`);
            console.log(`   - Script: "${payload.scriptBody.split('\n')[0]}..."`);

            // C. Simulate Conversation & Disposition
            console.log('\n[5] Simulating Conversation (2s)...');
            setTimeout(async () => {
                console.log('\n[6] Submitting Disposition: SALE');
                const dispRes = await fetch(`${API_URL}/calls/disposition`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        callId: payload.callId,
                        disposition: 'SALE',
                        notes: 'Customer interested in upgrade.'
                    })
                });

                const dispData = await dispRes.json();
                if (dispData.success) {
                    console.log('✅ Disposition Saved. Agent released to READY.');
                    resolve();
                } else {
                    reject(new Error('Disposition failed'));
                }
            }, 2000);
        });
    });

    // Trigger the Dial via API
    const dialRes = await fetch(`${API_URL}/calls/dial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            phoneNumber: targetPhone,
            leadId: 'lead_101',
            campaignId: 'cmp_uae_sales',
            region: 'AE' // UAE
        })
    });

    if (dialRes.status === 451) {
        console.log('🛑 Call BLOCKED by Compliance Engine (Expected if outside hours/DNC)');
        process.exit(0);
    }

    if (!dialRes.ok) {
        console.error('❌ Dialing API Failed:', await dialRes.text());
        process.exit(1);
    }

    const dialData = await dialRes.json();
    console.log(`✅ Backend accepted call. ID: ${dialData.callId}. Waiting for Telephony events...`);

    // Wait for the full flow to complete
    await callPromise;

    console.log('\n✨ Simulation Complete! System Verified.');
    process.exit(0);
}

runSimulation().catch(err => {
    console.error('❌ Simulation Failed:', err);
    process.exit(1);
});
