const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["safe", "suspicious", "malicious"], 
    default: "safe" 
  },
  lastChecked: { type: Date, default: Date.now },
  checks: {
    malwarePatterns: Boolean,
    suspiciousTlds: Boolean,
    blacklistCheck: Boolean
  }
});

module.exports = mongoose.model("Link", LinkSchema);