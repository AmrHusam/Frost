/**
 * Phase 3 Negative Test Script
 * 
 * Verifies that the server strictly rejects malformed payloads.
 * Targets the 'call.accept' event with invalid data types.
 */

const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:3000';
// Mock JWT for authentication (Phase 4 will harden this, but we need it to connect)
const MOCK_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xIiwicm9sZSI6IkFHRU5UIiwiaWF0IjoxNTE2MjM5MDIyfQ.test';

console.log('\n🧪 Starting Phase 3 Negative Test: Contract Enforcement\n');

const socket = io(`${SERVER_URL}/agents`, {
    auth: { token: MOCK_JWT },
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('✅ Connected to /agents namespace');

    // TEST: Send malformed payload (callId as number instead of UUID string)
    // Expected: Server rejects via Zod validation, returns structured error in ack
    console.log('📤 Sending malformed payload: { v: 1, callId: 12345 }');

    socket.emit('call.accept', { v: 1, callId: 12345 }, (ack) => {
        console.log('\n📥 Received Acknowledgement:');
        console.log(JSON.stringify(ack, null, 2));

        if (ack.success === false && ack.error && ack.error.code === 'INVALID_PAYLOAD') {
            console.log('\n✅ TEST PASSED: Server rejected invalid payload with structured error.');
            process.exit(0);
        } else {
            console.error('\n❌ TEST FAILED: Server did not reject the invalid payload correctly.');
            process.exit(1);
        }
    });
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
});

// Timeout
setTimeout(() => {
    console.error('❌ Test timeout');
    process.exit(1);
}, 10000);
