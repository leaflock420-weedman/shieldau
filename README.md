# ShieldAU

Australian lawyer-connection platform demo — inspired by Attorney Shield, built for QLD/NSW/VIC compliance.

**Live demo:** https://leaflock420-weedman.github.io/shieldau/

**GitHub:** https://github.com/leaflock420-weedman/shieldau

## Features

- Instant lawyer video connect (demo UI)
- Shield Credit subscription billing (15-min block → per-min → hourly)
- Digital Glovebox (encrypted ID storage demo)
- Emergency contact SMS + location alerts
- Family plan / sub-accounts
- Know Your Rights (QLD, NSW, VIC)
- Aboriginal Legal Services links (ATSILS, ALS, VALS)
- Medicinal cannabis module

## Run locally

Open `index.html` in a browser, or:

```bash
npx serve .
```

## Tests

```bash
node test-shieldau.js
```

## Deploy

### Render

1. Push this repo to GitHub
2. [Render Dashboard](https://dashboard.render.com) → New → Static Site
3. Connect repo → Build command: `echo ok` → Publish directory: `.`

Or use the included `render.yaml` with Render Blueprint.

### GitHub Pages

Settings → Pages → Source: Deploy from branch `main` → folder `/ (root)`.

## Disclaimer

Non-functional prototype. Not legal advice. Production requires licensed lawyers, Privacy Act compliance, and Australian legal review.