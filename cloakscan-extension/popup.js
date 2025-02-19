document.getElementById("collect-links").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url) return alert("No URL found!");

  // Send URL to backend for analysis
  const response = await fetch("http://localhost:3000/api/links/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: tab.url }), // Pass URL to backend
  });

  const data = await response.json();

  // Display results in the popup
  document.getElementById("results").innerHTML = `
    <h3>Analysis Results:</h3>
    <ul>
      ${data.results.map(link => `<li>${link.url}: ${link.status}</li>`).join("")}
    </ul>
  `;
});


// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "LINK_ANALYSIS") {
    displayResults(message.data);
  }
});

// Display results function
function displayResults(data) {
  const resultsContainer = document.getElementById("results");
  if (!data || !data.results) {
    resultsContainer.innerHTML = `<p>No links found.</p>`;
    return;
  }

  const maliciousLinks = data.results.filter(link => link.status === "malicious");

  resultsContainer.innerHTML = maliciousLinks.length > 0
    ? `
      <div class="warning">🚨 <strong>${maliciousLinks.length} malicious link(s) detected!</strong></div>
      <ul class="malicious-list">
        ${maliciousLinks.map(link => `
          <li>
            <a href="${link.url}" target="_blank">${link.url}</a>
            <span class="status-badge danger">${link.status.toUpperCase()}</span>
          </li>
        `).join('')}
      </ul>`
    : `<div class="safe">✅ No malicious links found!</div>`;
}
