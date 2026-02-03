
const { chromium } = require('playwright');

(async () => {
    console.log('Starting Agent Simulation (Fixed)...');

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

            console.log('Entering credentials...');
            await page.fill('input[type="email"]', 'agent@test.com');
            await page.fill('input[type="password"]', 'pass');

            console.log('Looking for Login button...');
            const buttons = await page.locator('button').allInnerTexts();
            console.log('Available buttons:', buttons);

            // Try generic submit or known text
            if (await page.locator('button[type="submit"]').isVisible()) {
                console.log('Clicking button[type="submit"]...');
                await page.click('button[type="submit"]');
            } else {
                console.log('Clicking by text match...');
                // Try a few common variations
                await page.click('button:has-text("Login"), button:has-text("Sign In"), button:has-text("Submit"), button:has-text("Continue")');
            }

            await page.waitForTimeout(3000);
            console.log(`Post-Login URL: ${page.url()}`);
        } else {
            console.log('No login form detected (or already logged in).');
        }

        // Verify Dashboard
        console.log('Verifying Dashboard...');
        // Dump body text if dashboard fails

        const keypadVisible = await page.locator('text=Keypad').isVisible() || await page.locator('.dialer-keypad').isVisible();
        console.log(`Keypad Visible: ${keypadVisible}`);

        const toggleVisible = await page.locator('button:has-text("Ready")').isVisible() || await page.locator('button:has-text("Not Ready")').isVisible();
        console.log(`Status Toggle Visible: ${toggleVisible}`);

        if (!keypadVisible && !toggleVisible) {
            console.log('Dashboard elements missing. Dumping page text:');
            const text = await page.innerText('body');
            console.log(text.substring(0, 500));
        }

        console.log('Simulation Complete.');

    } catch (error) {
        console.error('Simulation Failed:', error);
    } finally {
        await browser.close();
    }
})();
