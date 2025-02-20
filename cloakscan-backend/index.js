const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/links/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const analysisResults = await analyze(url); // Make sure this function returns actual data
    res.json({ results: analysisResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
});


app.get('/', (req, res) => {
  res.send('CloakScan Backend is working 🚀');
});

// Export the app for Vercel
module.exports = app;
