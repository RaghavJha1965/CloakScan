const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

// ✅ Root route for testing
app.get('/', (req, res) => {
  res.send('🚀 CloakScan Backend is running!');
});

app.post('/api/links/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const analysisResults = await analyze(url); // Pass the URL to analyze function
    res.json({ results: analysisResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
});

// ✅ Export the app for Vercel
module.exports = app;
