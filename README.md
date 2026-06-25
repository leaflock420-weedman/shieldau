# ShieldAU

Australian lawyer-connection platform demo — inspired by Attorney Shield, built for QLD/NSW/VIC compliance.

## Live demo

| Platform | URL |
|----------|-----|
| **Web app** | https://leaflock420-weedman.github.io/shieldau/ |
| **Install APK** | https://leaflock420-weedman.github.io/shieldau/install.html |
| **GitHub** | https://github.com/leaflock420-weedman/shieldau |

## 2-minute walkthrough

1. Accept terms → tap **INSTANT LAWYER VIDEO**
2. Pick a category → enable emergency alert → **Proceed**
3. Wait for match → **START VIDEO SESSION**
4. Tap **ID** → view Digital Glovebox docs
5. **End Session** → PIN `1234` → see billing summary
6. **More** → Family Plan, Emergency Contacts, Wallet

## Features

- Instant lawyer video connect (demo UI)
- Shield Credit subscription billing (15-min block → per-min → hourly)
- Digital Glovebox (encrypted ID storage demo)
- Emergency contact SMS + location alerts
- Family plan / sub-accounts
- Know Your Rights (QLD, NSW, VIC)
- Aboriginal Legal Services links (ATSILS, ALS, VALS)
- Medicinal cannabis module

## Tests

```bash
node test-shieldau.js
```

## Deploy

GitHub Pages is live from the `/docs` folder on `main`.

Android APK: see [APK-BUILD.md](APK-BUILD.md) or [Releases](https://github.com/leaflock420-weedman/shieldau/releases).

## Disclaimer

Non-functional prototype. Not legal advice. Production requires licensed lawyers, Privacy Act compliance, and Australian legal review.