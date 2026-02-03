
const { chromium } = require('playwright');

(async () => {
    console.log('Starting Visual Settings Tabs Verification (3x Loop)...');

    // HEADED MODE: Browser will open visibly with a slight delay for observation
    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to Agent Dashboard...');
        await page.goto('http://localhost:5173/agent');
        await page.waitForTimeout(1000);

        // Login if needed
        if (page.url().includes('login') || await page.getByPlaceholder(/email/i).isVisible()) {
            console.log('Logging in...');
            await page.fill('input[type="email"]', 'agent@test.com');
            await page.fill('input[type="password"]', 'pass');
            await page.click('button[type="submit"]');
            await page.waitForURL('**/agent', { timeout: 10000 });
            console.log('Logged in.');
        }

        // Navigate to Settings
        console.log('Clicking Settings...');
        await page.click('button:has-text("Settings")');
        await page.waitForTimeout(1000);

        // Verify Loop (3 times)
        for (let i = 1; i <= 3; i++) {
            console.log(`\n--- Test Cycle ${i}/3 ---`);

            // 1. Profile
            console.log('Clicking Profile...');
            await page.click('button:has-text("Profile")');
            if (!await page.getByRole('heading', { name: 'Agent Profile' }).isVisible()) throw new Error('Profile header missing');
            console.log('✅ Profile Tab OK');

            // 2. Language & Region
            console.log('Clicking Language & Region...');
            await page.click('button:has-text("Language & Region")');
            if (!await page.getByRole('heading', { name: 'Language & Region' }).isVisible()) throw new Error('Language header missing');
            console.log('✅ Language Tab OK');

            // 3. Notifications
            console.log('Clicking Notifications...');
            await page.click('button:has-text("Notifications")');
            if (!await page.getByRole('heading', { name: 'Notifications' }).isVisible()) throw new Error('Notifications header missing');
            console.log('✅ Notifications Tab OK');
        }

        console.log('\n🎉 ALL TESTS PASSED (3x Cycles)');
        // Keep open specifically for the user to see "The End" state for a moment
        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('Verification Failed:', error);
    } finally {
        await browser.close();
    }
})();
