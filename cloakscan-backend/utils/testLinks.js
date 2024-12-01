// // utils/testLinks.js
// const analyzeLink = require('./docker');

// async function testSingleLink(url) {
//   try {
//     console.log(`\nAnalyzing link: ${url}`);
//     const result = await analyzeLink(url);
//     console.log('Analysis result:', JSON.stringify(result, null, 2));
//   } catch (error) {
//     console.error('Analysis failed:', error.message);
//   }
// }

// // Only run if called directly
// if (require.main === module) {
//   const url = process.argv[2];
//   if (!url) {
//     console.log('Usage: node testLinks.js <url>');
//     process.exit(1);
//   }
//   testSingleLink(url);
// }

// module.exports = { testSingleLink };