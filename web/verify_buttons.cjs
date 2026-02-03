const { chromium } = require('playwright');

(async () => {
    console.log('Starting Button Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173');

        // Login
        console.log('Logging in...');
        await page.fill('input[type="email"]', 'agent@globaldialer.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000); // Wait for dashboard

        // 1. Verify "Add Lead" in Contacts
        console.log('Testing Contacts -> Add Lead...');
        await page.click('button:has-text("Contacts")');
        await page.waitForTimeout(500);

        // Look for Add Lead button
        const addLeadBtn = page.locator('button:has-text("Add Lead")');
        if (await addLeadBtn.isVisible()) {
            await addLeadBtn.click();
            console.log('✅ Clicked "Add Lead"');
            // Ideally verify toast, but for now just ensure it's clickable
            await page.waitForTimeout(500);
        } else {
            console.error('❌ "Add Lead" button not found');
            process.exit(1);
        }

        // 2. Verify Stats Buttons
        console.log('Testing Stats -> Buttons...');
        await page.click('button:has-text("Stats")');
        await page.waitForTimeout(500);

        const dateBtn = page.locator('button:has-text("Last 7 Days")');
        if (await dateBtn.isVisible()) {
            await dateBtn.click();
            console.log('✅ Clicked "Last 7 Days"');
            await page.waitForTimeout(500);
        } else {
            console.error('❌ "Last 7 Days" button not found');
            process.exit(1);
        }

        const downloadBtn = page.locator('button:has-text("Download Report")');
        if (await downloadBtn.isVisible()) {
            await downloadBtn.click();
            console.log('✅ Clicked "Download Report"');
            await page.waitForTimeout(500);
        } else {
            console.error('❌ "Download Report" button not found');
            process.exit(1);
        }

        console.log('All buttons verified successfully!');

    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
