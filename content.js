// List of sportsbook domains we care about (matches host_permissions in manifest.json)
const SPORTSBOOK_DOMAINS = [
  "betway.ca",
  "on.sportsbook.fanduel.ca",
  "sports.on.betmgm.ca",
  "on.betmgm.ca",
  "www.on.betmgm.ca",
  "sportsbook.draftkings.com",
  "on.pointsbet.ca",
  "on.bet99.ca",
  "www.betano.ca",
  "www.pinnacle.ca"
];

document.addEventListener("click", async (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;

  const url = link.href;
  const matchesBook = SPORTSBOOK_DOMAINS.some((domain) => url.includes(domain));
  if (!matchesBook) return;

  // Stop PickTheOdds from opening a new tab and fixes this bug https://discord.com/channels/1171897951648489532/1433797411704275056
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  link.removeAttribute("target");

  chrome.runtime.sendMessage({ action: "openSportsbook", url });

}, true);
