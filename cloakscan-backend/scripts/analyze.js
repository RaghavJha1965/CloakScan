process.env.PUPPETEER_DEBUG = '1'; // Enable Puppeteer debug logs
const puppeteer = require('puppeteer');

async function analyze() {
    try {
        if (!process.env.TARGET_URL) {
            throw new Error('TARGET_URL environment variable not set.');
        }

        let url = process.env.TARGET_URL;

        // Validate and normalize the URL
        try {
            if (!/^https?:\/\//i.test(url)) {
                url = `http://${url}`; // Prepend "http://" if no protocol is provided
            }
            url = new URL(url).toString(); // Validate and format the URL
        } catch (error) {
            throw new Error(`Invalid URL provided: ${process.env.TARGET_URL}`);
        }

        console.log(`Navigating to: ${url}`);

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser', // Explicitly specify Chromium path
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-dev-shm-usage',
            ],
        });
        

        console.log('Puppeteer launched successfully.');
        const page = await browser.newPage();
        console.log('New page created.');

        // Navigate to the URL
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            console.log('Page loaded successfully.');
        } catch (error) {
            throw new Error(`Failed to load the page: ${error.message}`);
        }

        // Extract page content and details
        const title = await page.title();
        console.log(`Page title: ${title}`);

        const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
        console.log(`Found ${links.length} links on the page.`);

        const result = {
            title: title || 'N/A',
            linkCount: links.length,
            links,
        };

        console.log('Analysis result:', JSON.stringify(result, null, 2));

        await browser.close();
        console.log('Browser closed successfully.');
    } catch (error) {
        console.error('Error during analysis:', error.message);
        process.exit(1); // Exit with failure code
    }
}

analyze();
