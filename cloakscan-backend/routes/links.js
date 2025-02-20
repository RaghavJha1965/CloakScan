const express = require('express');
const router = express.Router();
const analyze = require('../scripts/analyze'); // Adjust the path if needed

router.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const analysisResults = await analyze(url);
    res.json({ results: analysisResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
});

module.exports = router;
