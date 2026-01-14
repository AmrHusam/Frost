import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Audit Logs: Admin Only
router.get('/logs', authenticate, requireRole(['ADMIN', 'SUPERVISOR']), (req, res) => {
    // Return mocked audit trail
    res.json([
        { id: 1, event: 'CALL_BLOCKED', reason: 'TIME_WINDOW', region: 'UA', timestamp: new Date() },
        { id: 2, event: 'CONSENT_VALIDATED', token: 'TOK_123', region: 'SA', timestamp: new Date() }
    ]);
});

// Check Number Status (Ad-hoc check)
router.post('/check', authenticate, (req, res) => {
    const { number, region } = req.body;
    // Mock Check
    res.json({ status: 'ALLOWED', reasons: [] });
});

export default router;
