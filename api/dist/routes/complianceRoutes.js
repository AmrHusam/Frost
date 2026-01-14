"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Audit Logs: Admin Only
router.get('/logs', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['ADMIN', 'SUPERVISOR']), (req, res) => {
    // Return mocked audit trail
    res.json([
        { id: 1, event: 'CALL_BLOCKED', reason: 'TIME_WINDOW', region: 'UA', timestamp: new Date() },
        { id: 2, event: 'CONSENT_VALIDATED', token: 'TOK_123', region: 'SA', timestamp: new Date() }
    ]);
});
// Check Number Status (Ad-hoc check)
router.post('/check', authMiddleware_1.authenticate, (req, res) => {
    const { number, region } = req.body;
    // Mock Check
    res.json({ status: 'ALLOWED', reasons: [] });
});
exports.default = router;
