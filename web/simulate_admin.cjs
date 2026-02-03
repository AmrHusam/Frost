
const { chromium } = require('playwright');

(async () => {
    console.log('Starting Admin Simulation (Fixed)...');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(2000);

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        // Check for login
        if (page.url().includes('/login') || await page.getByPlaceholder(/email/i).isVisible() || await page.locator('input[type="password"]').isVisible()) {
            console.log('Login form detected.');

            console.log('Entering Admin credentials...');
            await page.fill('input[type="email"]', 'admin@test.com');
            await page.fill('input[type="password"]', 'admin');

            console.log('Looking for Login button...');
            const buttons = await page.locator('button').allInnerTexts();
            console.log('Available buttons:', buttons);

            if (await page.locator('button[type="submit"]').isVisible()) {
                console.log('Clicking button[type="submit"]...');
                await page.click('button[type="submit"]');
            } else {
                console.log('Clicking by text match...');
                await page.click('button:has-text("Login"), button:has-text("Sign In"), button:has-text("Enter"), button:has-text("Submit")');
            }

            await page.waitForTimeout(3000);
            console.log(`Post-Login URL: ${page.url()}`);
        } else {
            console.log('No login form detected (or already logged in).');
        }

        // Verify Admin Dashboard
        console.log('Verifying Admin Dashboard...');

        // Live Calls
        const liveCalls = await page.locator('text=Live Calls').isVisible() || await page.locator('text=Active Calls').isVisible();
        console.log(`Live Calls Widget Visible: ${liveCalls}`);

        // Active Agents
        const activeAgents = await page.locator('text=Active Agents').isVisible() || await page.locator('text=Agents').isVisible();
        console.log(`Active Agents List Visible: ${activeAgents}`);

        // Dump text
        const text = await page.innerText('body');
        console.log('Page Text Preview:');
        console.log(text.substring(0, 1000));

        // User Management
        console.log('Checking for User Management link...');
        // Look for text "Users" or "Team"
        const usersLink = page.getByRole('link', { name: /users/i }).or(page.getByRole('link', { name: /team/i }));
        if (await usersLink.isVisible()) {
            console.log('Users/Team link found.');
            await usersLink.click();
            await page.waitForTimeout(1000);
            console.log(`Navigation to: ${page.url()}`);

            // Check for Add User
            const addUser = await page.getByRole('button', { name: /add/i }).isVisible();
            console.log(`Add User/Agent Button Visible: ${addUser}`);
        } else {
            console.log('Users link not explicitly found in menu.');
        }

        console.log('Admin Simulation Complete.');

    } catch (error) {
        console.error('Simulation Failed:', error);
    } finally {
        await browser.close();
    }
})();
