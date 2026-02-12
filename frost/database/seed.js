const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// Output file path
const outputPath = path.join(__dirname, 'seed_data.sql');

function appendSql(sql) {
    fs.appendFileSync(outputPath, sql + '\n');
}

async function generateSeed() {
    try {
        console.log('Generating seed data...');

        // Clear existing file
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        // Add Drop Tables
        appendSql('DROP TABLE IF EXISTS calls CASCADE;');
        appendSql('DROP TABLE IF EXISTS scripts CASCADE;');
        appendSql('DROP TABLE IF EXISTS campaigns CASCADE;');
        appendSql('DROP TABLE IF EXISTS contacts CASCADE;');
        appendSql('DROP TABLE IF EXISTS users CASCADE;');
        appendSql('');

        // Add Schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        appendSql('-- Schema Definition');
        appendSql(schemaSql);
        appendSql('\n-- Seed Data\n');

        // Seed Users
        console.log('Generating users...');
        const usersIids = []; // Fake IDs for reference
        const roles = ['admin', 'agent'];
        for (let i = 1; i <= 5; i++) {
            const role = i === 1 ? 'admin' : 'agent';
            const username = faker.internet.userName();
            const email = faker.internet.email();
            const password = faker.internet.password(); // In real app, hash this

            const sql = `INSERT INTO users (username, email, password_hash, role, status) VALUES ('${username.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${password.replace(/'/g, "''")}', '${role}', 'active');`;
            appendSql(sql);
            usersIids.push(i);
        }

        // Seed Contacts
        console.log('Generating contacts...');
        const contactIds = [];
        const statuses = ['new', 'contacted', 'qualified', 'customer', 'churned'];
        for (let i = 1; i <= 50; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email();
            const phone = faker.phone.number().substring(0, 20);
            const company = faker.company.name();
            const status = faker.helpers.arrayElement(statuses);

            const sql = `INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('${firstName.replace(/'/g, "''")}', '${lastName.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${phone.replace(/'/g, "''")}', '${company.replace(/'/g, "''")}', '${status}');`;
            appendSql(sql);
            contactIds.push(i);
        }

        // Seed Campaigns
        console.log('Generating campaigns...');
        const campaignIds = [];
        const campaignNames = [];
        for (let i = 1; i <= 3; i++) {
            const name = faker.commerce.productName() + ' Launch';
            const description = faker.lorem.sentence();
            const startDate = faker.date.past().toISOString().split('T')[0];
            const status = 'active';

            const sql = `INSERT INTO campaigns (name, description, start_date, status) VALUES ('${name.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', '${startDate}', '${status}');`;
            appendSql(sql);
            campaignIds.push(i);
            campaignNames.push(name);
        }

        // Seed Scripts
        console.log('Generating scripts...');
        let campaignCounter = 1;
        for (let i = 0; i < 3; i++) {
            const title = 'Cold Call Script V1';
            const content = faker.lorem.paragraphs(2);

            const sql = `INSERT INTO scripts (title, content, campaign_id) VALUES ('${title.replace(/'/g, "''")}', '${content.replace(/'/g, "''")}', ${campaignCounter});`;
            appendSql(sql);
            campaignCounter++;
        }

        // Seed Calls
        console.log('Generating calls...');
        const outcomes = ['connected', 'voicemail', 'wrong_number', 'busy'];
        for (let i = 0; i < 100; i++) {
            const contactId = faker.helpers.arrayElement(contactIds);
            const userId = faker.helpers.arrayElement(usersIids);
            const campaignId = faker.helpers.arrayElement(campaignIds);
            const duration = faker.number.int({ min: 10, max: 600 });
            const outcome = faker.helpers.arrayElement(outcomes);
            const notes = faker.lorem.sentence();
            const recordingUrl = faker.internet.url();

            const sql = `INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (${contactId}, ${userId}, ${campaignId}, ${duration}, '${outcome}', '${notes.replace(/'/g, "''")}', '${recordingUrl}');`;
            appendSql(sql);
        }

        console.log(`Seeding complete! SQL generated at ${outputPath}`);

    } catch (err) {
        console.error('Error generating seed data:', err);
    }
}

generateSeed();
