// background.js

const DOMAIN_CANONICAL = {
  "sports.on.betmgm.ca": "on.betmgm.ca",
  "www.on.betmgm.ca": "on.betmgm.ca",
  "on.betmgm.ca": "on.betmgm.ca"
};

function getCanonicalDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return DOMAIN_CANONICAL[hostname] || hostname;
  } catch {
    return url;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action !== "openSportsbook") return;

  try {
    const targetUrl = message.url;
    const targetDomain = getCanonicalDomain(targetUrl);

    const tabs = await chrome.tabs.query({});

    // Try tab in another window first
    let existing = tabs.find(
      (tab) =>
        getCanonicalDomain(tab.url || "") === targetDomain &&
        tab.id !== sender.tab.id &&
        tab.windowId !== sender.tab.windowId
    );

    // Fallback to any tab in same or other window
    if (!existing) {
      existing = tabs.find(
        (tab) =>
          getCanonicalDomain(tab.url || "") === targetDomain &&
          tab.id !== sender.tab.id
      );
    }

    if (existing) {
      console.log(`[PTO Tab Handler] Reusing tab for ${targetDomain} in window ${existing.windowId}, tabId ${existing.id}`);
      await chrome.tabs.update(existing.id, { url: targetUrl });
      await chrome.windows.update(existing.windowId, { focused: true });
      await chrome.tabs.update(existing.id, { active: true });
    } else {
      console.log(`[PTO Tab Handler] Opening new tab for ${targetDomain}`);
      await chrome.tabs.create({ url: targetUrl, active: true });
    }
  } catch (error) {
    console.error("[PTO Tab Handler] Error handling sportsbook open:", error);
  }
});
