"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Mock User DB Lookup
    if (email === 'agent@test.com' && password === 'pass') {
        const token = jsonwebtoken_1.default.sign({ id: 'usr_1', role: 'AGENT', name: 'Test Agent' }, JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token, user: { id: 'usr_1', role: 'AGENT', name: 'Test Agent' } });
    }
    if (email === 'admin@test.com' && password === 'admin') {
        const token = jsonwebtoken_1.default.sign({ id: 'usr_99', role: 'ADMIN', name: 'Super Admin' }, JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token, user: { id: 'usr_99', role: 'ADMIN', name: 'Super Admin' } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});
exports.default = router;
