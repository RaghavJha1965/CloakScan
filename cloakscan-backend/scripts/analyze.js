const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const SAFE_BROWSING_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const SAFE_BROWSING_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_URL = 'https://www.virustotal.com/api/v3/files';

async function checkLinkSafety(url) {
  try {
    
    const response = await fetch(SAFE_BROWSING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: { clientId: 'cloakscan', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
    });

    const data = await response.json();
    
    return data.matches ? 'Malicious (via Safe Browsing)' : 'Safe';
  } catch (err) {
    console.error(`Error checking ${url}: ${err.message}`);
    return 'Unknown';
  }
}

async function scanFileWithVirusTotal(filePath) {
  try {
    
    const fileStream = fs.createReadStream(filePath);
    const response = await fetch(VIRUSTOTAL_URL, {
      method: 'POST',
      headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
      body: fileStream,
    });

    const result = await response.json();
    
    return result.data ? 'Malicious (via VirusTotal)' : 'Safe';
  } catch (error) {
    console.error(`Error scanning file: ${error.message}`);
    return 'Unknown';
  }
}

async function handleFileLink(url) {
    const filename = path.basename(url);
    const filePath = path.join('/tmp', filename);
  
    try {
      
  
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': url, // Sometimes needed
        },
      });

  
      if (!res.ok) throw new Error(`Failed to download file. Status: ${res.status}`);
  
      const fileStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on('error', reject);
        fileStream.on('finish', resolve);
      });
  
      
      const scanResult = await scanFileWithVirusTotal(filePath);
      fs.unlinkSync(filePath); // Clean up
      return scanResult;
    } catch (error) {
      console.error(`❌ File handling error: ${error.message}`);
      return 'Failed to analyze file';
    }
  }
  
    

  async function scanUrlWithVirusTotal(url) {
    try {
      
  
      // Step 1: Submit the URL for scanning
      const encodedUrl = Buffer.from(url).toString('base64').replace(/=+$/, '');
      const response = await fetch(`https://www.virustotal.com/api/v3/urls`, {
        method: 'POST',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`,
      });
  
      const data = await response.json();
      if (!data.data || !data.data.id) {
        throw new Error("Failed to submit URL for scanning.");
      }
  
      const analysisId = data.data.id;
  
      // Step 2: Retrieve the analysis result
      const resultResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        method: 'GET',
        headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
      });
  
      const result = await resultResponse.json();
  
      
  
      const maliciousVotes = result.data.attributes.stats.malicious;
      
  
      return maliciousVotes > 0 ? 'Malicious (via VirusTotal)' : 'Safe';
    } catch (error) {
      console.error(`❌ Error scanning URL: ${error.message}`);
      return 'Unknown';
    }
  }
    

async function analyze(url) {
  
  

  const fileExtensions = ['.pdf', '.lnk', '.exe', '.zip', '.rar'];
  const extension = path.extname(url).toLowerCase();

  if (fileExtensions.includes(extension)) {
    
    const fileAnalysis = await handleFileLink(url);
    
  } else {
    let browser;
    try {
      

      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser', // Required inside Docker
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage', // Prevents shared memory issues
          '--disable-software-rasterizer',
        ],
      });

      

      // ✅ Fix: Declare `page` outside the inner try block
      const page = await browser.newPage();
      

      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 100000 });
      

      const links = await page.$$eval('a', anchors => anchors.map(a => a.href));
      

      
      const analyzedLinks = await Promise.all(
        links.map(async (link) => ({
          url: link,
          status: `${await checkLinkSafety(link)} | ${await scanUrlWithVirusTotal(link)}`,
        }))
      );

      analyzedLinks.forEach(({ url, status }) => {
        
      });

      
    } catch (err) {
      console.error(`🚨 Error processing page: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close();
        
      }
    }
  }
}

analyze();

