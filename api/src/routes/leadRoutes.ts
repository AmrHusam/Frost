import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// List All Leads
router.get('/', authenticate, (req, res) => {
    res.json({
        leads: [
            { id: 'lead_001', name: 'James Wilson', phone: '+971501111111', status: 'NEW' },
            { id: 'lead_002', name: 'Sarah Brown', phone: '+971502222222', status: 'INTERESTED' },
            { id: 'lead_003', name: 'Michael Chen', phone: '+971503333333', status: 'DO_NOT_CALL' },
            { id: 'lead_004', name: 'Elena Gomez', phone: '+971504444444', status: 'FOLLOW_UP' },
            { id: 'lead_005', name: 'Ahmed Hassan', phone: '+971505555555', status: 'NEW' },
        ]
    });
});

// Pop Next Lead (for Agent)
router.post('/pop', authenticate, requireRole(['AGENT']), (req, res) => {
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
router.get('/:id', authenticate, (req, res) => {
    const { id } = req.params;
    res.json({
        id,
        name: 'John Doe',
        history: []
    });
});

export default router;
