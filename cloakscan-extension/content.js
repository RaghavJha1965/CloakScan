// This script is loaded on every page to facilitate interactions.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "collectLinks") {
    const links = Array.from(document.querySelectorAll("a[href]")).map((a) => a.href);
    sendResponse({ links });
  }
});

