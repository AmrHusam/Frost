
const { chromium } = require('playwright');

(async () => {
    console.log('Starting Settings Tabs Reproduction (Robust)...');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to Settings...');
        await page.goto('http://localhost:5173/agent/settings');

        // Allow time for redirects (e.g. to login)
        await page.waitForTimeout(1000);

        // Login Handling
        if (page.url().includes('login') || await page.getByPlaceholder(/email/i).isVisible()) {
            console.log('Login required. Logging in...');
            await page.fill('input[type="email"]', 'agent@test.com');
            await page.fill('input[type="password"]', 'pass');
            await page.click('button[type="submit"]');

            // Wait for dashboard/settings
            await page.waitForURL('**/agent**', { timeout: 10000 });
            console.log('Logged in. Navigating back to Settings...');
            await page.goto('http://localhost:5173/agent/settings');
            await page.waitForTimeout(2000); // Wait for load
        } else {
            console.log('Already logged in or no redirect.');
        }

        // 1. Check Profile Tab (Default)
        console.log('Checking Profile Tab...');

        // Debug: Dump what's on the page if we fail
        const profileText = await page.getByRole('heading', { name: 'Agent Profile' }).isVisible();
        const logoutText = await page.getByText('Account Actions').isVisible();

        console.log(`Profile Content Visible: ${profileText}`);
        console.log(`Account Actions Visible: ${logoutText}`);

        if (!profileText) {
            console.log('!!! Profile Content Missing !!!');
            console.log('Current URL:', page.url());
            console.log('Page Title:', await page.title());
            const bodyText = await page.innerText('body');
            console.log('Body Text Preview:', bodyText.substring(0, 500));
            throw new Error('Profile content should be visible initially');
        }

        // 2. Click "Language & Region"
        console.log('Switching to "Language & Region"...');
        // Ensure button is visible before clicking
        await page.locator('button:has-text("Language & Region")').waitFor({ state: 'visible' });
        await page.locator('button:has-text("Language & Region")').click();
        await page.waitForTimeout(500);

        // 3. Verify Issue
        const languageContent = await page.getByRole('heading', { name: 'Language & Region' }).isVisible();
        const profileTextAfter = await page.getByRole('heading', { name: 'Agent Profile' }).isVisible();
        const logoutTextAfter = await page.getByText('Account Actions', { exact: false }).first().isVisible();

        console.log(`Language Content Visible: ${languageContent}`);
        console.log(`Profile Content Visible (After): ${profileTextAfter}`);
        console.log(`Account Actions Visible (After): ${logoutTextAfter}`);

        if (!languageContent && logoutTextAfter) {
            console.log('✅ REPRODUCTION SUCCESS: Bug confirmed. "Account Actions" is visible, but "Language & Region" content is missing.');
        } else {
            console.log('❌ REPRODUCTION FAILED or Different State Observed.');
        }

    } catch (error) {
        console.error('Reproduction Script Error:', error);
    } finally {
        await browser.close();
    }
})();
