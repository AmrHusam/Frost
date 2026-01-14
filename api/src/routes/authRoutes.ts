import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Mock User DB Lookup
    if ((email === 'agent@test.com' && password === 'pass') ||
        (email === 'agent@frost.com' && password === 'password123') ||
        (email === 'agent@globaldialer.com' && password === 'password')) {
        const token = jwt.sign(
            { id: 'usr_1', role: 'AGENT', name: 'Test Agent' },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        return res.json({ token, user: { id: 'usr_1', role: 'AGENT', name: 'Test Agent' } });
    }

    if ((email === 'admin@test.com' && password === 'admin') || (email === 'admin@frost.com' && password === 'admin123')) {
        const token = jwt.sign(
            { id: 'usr_99', role: 'ADMIN', name: 'Super Admin' },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        return res.json({ token, user: { id: 'usr_99', role: 'ADMIN', name: 'Super Admin' } });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
