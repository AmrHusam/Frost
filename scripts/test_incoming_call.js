
// Script to simulate incoming call
const fetch = require('node-fetch'); // You might need to install this or use built-in 18+

async function triggerCall() {
    try {
        const response = await fetch('http://localhost:3000/api/calls/incoming', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: "+15550109988",
                to: "+15550105555",
                callId: "call-" + Date.now()
            })
        });
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (e) {
        console.error(e);
    }
}
triggerCall();
