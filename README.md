# PTO Sportsbook Tab Handler

A Chrome extension that reuses existing sportsbook tabs when clicking links from PickTheOdds.app and also blocking referrer data from being passed on to the sportbooks.

## Features

- **Tab Reuse**: Automatically detects and reuses existing sportsbook tabs instead of opening new ones.
- **Multi-Domain/Redirect Support**: Handles multiple variants of the same sportsbook (e.g., sports.on.betmgm.ca, www.on.betmgm.ca), useful for when you get redirected.
- **Cross-Window Support**: Prioritizes tabs in different windows to keep your workspace organized
- **Referrer Prevention**: Stops PickTheOdds.app from opening links in new tabs with referrer data

## Supported Sportsbooks

- Betway (betway.ca)
- FanDuel (on.sportsbook.fanduel.ca)
- BetMGM (sports.on.betmgm.ca, www.on.betmgm.ca, on.betmgm.ca)
- DraftKings (sportsbook.draftkings.com)
- PointsBet (on.pointsbet.ca)
- Bet99 (on.bet99.ca)
- Betano (www.betano.ca)
- Pinnacle (www.pinnacle.ca)

*its easy to add more books, see [here](#Adding-New-Sportsbooks)

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `pto-tab-handler` directory
6. The extension icon should appear in your Chrome toolbar

### Updating

After making changes to the code:
1. Go to `chrome://extensions/`
2. Click the reload icon on the PTO Sportsbook Tab Handler card

## Usage

1. **Enable the Extension**: Click the extension icon in your Chrome toolbar and ensure "Enable Tab Reuse" is checked (enabled by default)

2. **Browse PickTheOdds.app**: Navigate to picktheodds.app and click any sportsbook links

3. **Automatic Tab Management**: The extension will:
   - Look for an existing tab with the same sportsbook domain
   - Prioritize tabs in different windows first
   - Reuse the found tab by updating its URL
   - Or open a new tab if no existing one is found


## File Structure

```
pto-tab-handler/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for tab management
├── content.js          # Content script for link interception
├── popup.html          # Extension popup UI
├── popup.js            # Popup functionality
├── icons/
│   └── favicon.ico     # Extension icon
└── README.md           # This file
```

## How It Works

### Content Script (content.js)
- Runs on picktheodds.app pages
- Intercepts clicks on sportsbook links
- Prevents default link behavior
- Sends message to background script with target URL

### Background Script (background.js)
- Receives messages from content script
- Queries all open tabs
- Implements canonical domain mapping for multi-domain sportsbooks
- Finds existing tabs with matching domains
- Updates existing tabs or creates new ones
- Handles window focusing and tab activation

### Domain Canonicalization
BetMGM has multiple subdomains that point to the same service. The extension maps these to a canonical domain:
- `sports.on.betmgm.ca` → `on.betmgm.ca`
- `www.on.betmgm.ca` → `on.betmgm.ca`
- `on.betmgm.ca` → `on.betmgm.ca`

This ensures that clicking a link to any BetMGM subdomain will reuse any open BetMGM tab.

## Configuration

### Adding New Sportsbooks

To add support for additional sportsbooks:

1. **Update manifest.json** - Add host permission:
```json
"host_permissions": [
  "*://newsportsbook.com/*"
]
```

2. **Update content.js** - Add domain to array:
```javascript
const SPORTSBOOK_DOMAINS = [
  "newsportsbook.com"
];
```

3. **Update background.js** (if needed) - Add canonical mapping if the sportsbook has multiple domains:
```javascript
const DOMAIN_CANONICAL = {
  "www.newsportsbook.com": "newsportsbook.com",
  "sports.newsportsbook.com": "newsportsbook.com"
};
```

## Version History
- **v0.1**
  - Added domain list
  - Added redirect and referrer stripping logic
  - Improved canonical domain mapping


## Privacy

This extension:
- ✅ Only runs on picktheodds.app and specified sportsbook sites
- ✅ Does not collect or transmit any user data
- ✅ Does not track browsing history
- ✅ Stores only a single boolean preference (enabled/disabled) locally
- ✅ Prevents referrer data from being sent to sportsbooks

## License

This project is provided as-is for personal use.
