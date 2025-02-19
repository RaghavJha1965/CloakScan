// Listen for tab updates (when the URL changes or the page reloads)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^https?:/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: collectAndSendLinks,
    });
  }
});

function collectAndSendLinks() {
  const links = Array.from(document.querySelectorAll("a[href]")).map((a) => a.href);

  fetch("http://localhost:3000/api/links/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ links }),
  })
    .then(response => response.json())
    .then(data => {
      // Send results to popup
      chrome.runtime.sendMessage({ type: "LINK_ANALYSIS", data });
    })
    .catch(err => console.error("Error analyzing links:", err));
}
