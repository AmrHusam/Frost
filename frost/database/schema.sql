-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'agent')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('new', 'contacted', 'qualified', 'customer', 'churned')) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns Table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'completed', 'paused')) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calls Table
CREATE TABLE calls (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    user_id INTEGER REFERENCES users(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    duration_seconds INTEGER,
    outcome VARCHAR(50),
    notes TEXT,
    recording_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scripts Table
CREATE TABLE scripts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    campaign_id INTEGER REFERENCES campaigns(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
