process.env.PUPPETEER_DEBUG = '1'; // Enable Puppeteer debug logs
const puppeteer = require('puppeteer');

async function analyze() {
    console.log(`Navigating to: ${process.env.TARGET_URL}`);
    
    try {
        await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('Page loaded successfully.');
    } catch (error) {
        console.error('Error loading the page:', error.message);
    }

    try {
        const content = await page.content();
        console.log('Page content snippet:', content.substring(0, 500));
    } catch (error) {
        console.error('Error retrieving content:', error.message);
    }

    try {
        const title = await page.title();
        console.log(`Page title: ${title}`);
    } catch (error) {
        console.error('Error retrieving title:', error.message);
    }

    try {
        const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
        console.log(`Found ${links.length} links on the page.`);
    } catch (error) {
        console.error('Error retrieving links:', error.message);
    }
}

// Call the analyze function
analyze();
