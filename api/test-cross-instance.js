/**
 * Cross-Instance Test Script
 * 
 * Tests that events emitted from Server 2 reach clients connected to Server 1
 * This validates Redis Pub/Sub is working correctly
 */

const { io } = require('socket.io-client');

// Test configuration
const SERVER_1_URL = 'http://localhost:3000';
const SERVER_2_URL = 'http://localhost:3001';
const TEST_TIMEOUT = 15000;

// Mock JWT token (in real scenario, this would be valid)
const MOCK_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xIiwicm9sZSI6IkFHRU5UIiwiaWF0IjoxNTE2MjM5MDIyfQ.test';

let testPassed = false;
let socket1, socket2;

console.log('\n🧪 Starting Cross-Instance Test\n');
console.log('Expected behavior:');
console.log('  1. Client connects to Server 1 (port 3000)');
console.log('  2. Admin connects to Server 2 (port 3001)');
console.log('  3. Admin emits event from Server 2');
console.log('  4. Client on Server 1 receives event (via Redis Pub/Sub)');
console.log('  5. Test PASSES if event is received\n');

// Step 1: Connect to Server 1
console.log('📡 Step 1: Connecting to Server 1...');
socket1 = io(`${SERVER_1_URL}/agents`, {
    auth: { token: MOCK_JWT },
    transports: ['websocket'],
    reconnection: false
});

socket1.on('connect', () => {
    console.log('✅ Connected to Server 1 (Socket ID: ' + socket1.id + ')');

    // Listen for test event
    socket1.on('test.crossInstance', (data) => {
        console.log('\n🎉 SUCCESS: Cross-instance event received!');
        console.log('   Data:', JSON.stringify(data, null, 2));
        console.log('\n✅ CROSS-INSTANCE TEST PASSED\n');
        testPassed = true;
        cleanup();
    });

    // Step 2: Connect to Server 2 after Server 1 is ready
    setTimeout(connectToServer2, 2000);
});

socket1.on('connect_error', (err) => {
    console.error('❌ Server 1 connection error:', err.message);
    console.error('   Make sure Server 1 is running on port 3000');
    cleanup();
});

function connectToServer2() {
    console.log('\n📡 Step 2: Connecting to Server 2...');
    socket2 = io(`${SERVER_2_URL}/agents`, {
        auth: { token: MOCK_JWT },
        transports: ['websocket'],
        reconnection: false
    });

    socket2.on('connect', () => {
        console.log('✅ Connected to Server 2 (Socket ID: ' + socket2.id + ')');

        // Step 3: Emit test event from Server 2
        setTimeout(() => {
            console.log('\n📤 Step 3: Emitting test event from Server 2...');
            socket2.emit('test.emit', {
                targetUserId: 'test-user-1',
                message: 'Cross-instance test message',
                timestamp: Date.now()
            });
            console.log('   Event emitted. Waiting for reception on Server 1...');
        }, 1000);
    });

    socket2.on('connect_error', (err) => {
        console.error('❌ Server 2 connection error:', err.message);
        console.error('   Make sure Server 2 is running on port 3001');
        cleanup();
    });
}

function cleanup() {
    setTimeout(() => {
        if (socket1) socket1.disconnect();
        if (socket2) socket2.disconnect();

        if (!testPassed) {
            console.error('\n❌ CROSS-INSTANCE TEST FAILED\n');
            console.error('Possible issues:');
            console.error('  - Redis not running');
            console.error('  - REDIS_URL not set in .env');
            console.error('  - Redis adapter not configured');
            console.error('  - Both servers not connected to same Redis instance\n');
            process.exit(1);
        } else {
            process.exit(0);
        }
    }, 1000);
}

// Timeout
setTimeout(() => {
    if (!testPassed) {
        console.error('\n❌ Test timeout - no event received within ' + (TEST_TIMEOUT / 1000) + ' seconds\n');
        cleanup();
    }
}, TEST_TIMEOUT);
