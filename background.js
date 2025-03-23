chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("url_relevante")) { // Reemplaza con la URL relevante
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    });
  }
});
