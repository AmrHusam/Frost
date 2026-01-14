"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Pop Next Lead (for Agent)
router.post('/pop', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['AGENT']), (req, res) => {
    // In real system: QueuManager.pop(agent.campaignId)
    res.json({
        lead: {
            id: 'lead_555',
            name: 'John Doe',
            phone: '+971500000000',
            region: 'UE',
            scriptId: 'script_welcome_v1'
        }
    });
});
// Get Lead Details
router.get('/:id', authMiddleware_1.authenticate, (req, res) => {
    const { id } = req.params;
    res.json({
        id,
        name: 'John Doe',
        history: []
    });
});
exports.default = router;
