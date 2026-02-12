require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Connection
const pool = new Pool({
    user: process.env.DB_USER || 'frost_admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'frost_db',
    password: process.env.DB_PASSWORD || 'secure_password_123',
    port: process.env.DB_PORT || 5432,
});

// Test DB Connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Connected to Database:', result.rows[0]);
    });
});

// Routes
app.get('/', (req, res) => {
    res.send('Frost API is running');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/db-check', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database(), current_user, version()');
        res.json({
            success: true,
            message: 'Database connected successfully',
            info: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: err.message
        });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password, email } = req.body;
    const loginIdentifier = username || email;

    try {
        // Allow login with username OR email
        const result = await pool.query(
            'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password_hash = $2',
            [loginIdentifier, password]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    email: user.email // Also return email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Contacts Endpoint for Dialer
app.get('/api/contacts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Catch-all 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
