const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'frost_admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'frost_db',
    password: process.env.DB_PASSWORD || 'secure_password_123',
    port: process.env.DB_PORT || 5432,
});

async function createAgent() {
    try {
        const username = 'AgentSmith';
        const email = 'agent@globaldialer.com';
        const password = 'password123';
        const role = 'agent';

        // Check if exists
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            console.log('User already exists');
        } else {
            await pool.query(
                `INSERT INTO users (username, email, password_hash, role, status) VALUES ($1, $2, $3, $4, 'active')`,
                [username, email, password, role]
            );
            console.log('User created successfully');
        }
    } catch (err) {
        console.error('Error creating user:', err);
    } finally {
        await pool.end();
    }
}

createAgent();
