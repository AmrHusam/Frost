import { Router } from 'express';
import { initiateManualCall, submitDisposition } from '../controllers/dialerController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Init Call: Agent Only
router.post('/dial', authenticate, requireRole(['AGENT']), initiateManualCall);

// Disposition: Agent Only (on wrap-up)
// Disposition: Agent Only (on wrap-up)
router.post('/disposition', authenticate, requireRole(['AGENT']), submitDisposition);

// Simulation: Incoming Call (Protected or Dev only)
router.post('/incoming', (req, res) => {
    const { from, to, callId } = req.body;
    const socketEmitter = req.app.locals.socketEmitter; // TypedEmitter

    if (!socketEmitter) {
        return res.status(500).json({ error: 'Socket emitter not available' });
    }

    // Broadcast to relevant agent (mocking assignment to ALL agents for demo/test)
    // In prod, this would go to a specific agent via room
    // For test: we emit to the namespace or just find a way to target.
    // TypedEmitter needs to know HOW to emit.
    // Let's use the raw IO for simulation or the namespace.
    // socketEmitter.toUser(userId)... 
    // Since we don't know the userId of the connected agent easily in this stateless req,
    // we will emit to the '/agents' namespace generally or to a known test user if possible.
    // OR, better: The frontend `useDialerListener` listens for `call.assigned`.

    // We need to access the IO instance to emit to all for the test, OR fix the test to login as specific user.
    // Only way to "Target" the specific agent is if we know their ID.
    // The test user is 'usr_1'.

    const socketManager = require('../server').default; // this might be circular or hard.
    // Accessing via app.locals.socketEmitter which is TypedEmitter.
    // TypedEmitter likely has .toUser().

    // Attempting to emit to user 'usr_1' (Test Agent)
    try {
        socketEmitter.in('user:usr_1').emit('call.assigned', {
            v: 1,
            callId: callId || `call-${Date.now()}`,
            direction: 'INBOUND',
            customerNumber: from || '+15550009999',
            queue: 'Sales',
            priority: 1
        });
        console.log(`[Validation] Simulating incoming call to usr_1`);
        return res.json({ success: true, message: 'Call dispatched to usr_1' });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
});

export default router;
