document.getElementById("collect-links").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: collectLinks,
      },
      async (results) => {
        if (results && results[0].result) {
          const links = results[0].result;
  
          // Send the links to the backend for analysis
          const response = await fetch("http://localhost:3000/api/links/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ links }),
          });
  
          const data = await response.json();
          console.log("Analysis results:", data);
  
          // Display results in the popup
          document.getElementById("results").innerHTML = `
            <h3>Analysis Results:</h3>
            <ul>
              ${data.results.map(link => `<li>${link.url}: ${link.status}</li>`).join("")}
            </ul>
          `;
        }
      }
    );
  });
  
  
  function collectLinks() {
    const links = Array.from(document.querySelectorAll("a[href]")).map((a) => a.href);
    return links;
  }
  