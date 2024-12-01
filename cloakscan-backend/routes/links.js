const express = require("express");
const router = express.Router();
const Link = require("../models/Link");
const analyzeLink = require("../utils/docker");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

router.use(limiter);

router.post("/analyze", async (req, res) => {
  const { links } = req.body;

  if (!links || !Array.isArray(links) || links.length === 0) {
    return res.status(400).json({ error: "No links provided for analysis" });
  }

  if (links.length > 10) {
    return res.status(400).json({ error: "Maximum 10 links per request" });
  }

  try {
    const results = await Promise.all(
      links.map(async (link) => {
        // Check cache
        const cached = await Link.findOne({
          url: link,
          lastChecked: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (cached) {
          return { url: link, status: cached.status, cached: true };
        }

        // Analyze new link
        const result = await analyzeLink(link);
        
        // Save to database
        await Link.findOneAndUpdate(
          { url: link },
          { 
            status: result.status,
            checks: result.details,
            lastChecked: new Date()
          },
          { upsert: true }
        );

        return { url: link, ...result };
      })
    );

    res.json({ status: "success", results });
  } catch (error) {
    console.error("Error analyzing links:", error);
    res.status(500).json({ error: "Failed to analyze links" });
  }
});

module.exports = router;