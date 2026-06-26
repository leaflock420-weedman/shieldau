# ShieldAU

Australian lawyer-connection platform demo — inspired by Attorney Shield, built for QLD/NSW/VIC compliance.

## Live demo

| Platform | URL |
|----------|-----|
| **Web app (Render — primary)** | https://shieldau.onrender.com |
| **Web app (GitHub Pages backup)** | https://leaflock420-weedman.github.io/shieldau/ |
| **GitHub** | https://github.com/leaflock420-weedman/shieldau |

## 2-minute walkthrough

1. Accept terms → tap **INSTANT LAWYER VIDEO**
2. Pick a category → enable emergency alert → **Proceed**
3. Wait for match → **START VIDEO SESSION**
4. Tap **ID** → view Digital Glovebox docs
5. **End Session** → PIN `1234` → see billing summary
6. **More** → Family Plan, Emergency Contacts, Wallet

## Features

- **Emergency video connect** — instant lawyer during police interactions (Attorney Shield core)
- **24/7 legal hotline** — unlimited consults on covered matters (LegalShield)
- **Ask a Lawyer** — rated expert chat Q&A (JustAnswer)
- **Legal templates + e-sign** — stat decs, wills, employment, complaints (Rocket Lawyer / LegalZoom)
- **Document review** — upload contracts for lawyer review (Rocket Lawyer)
- **Letters & calls for you** — panel lawyer acts on your behalf (LegalShield)
- **Business legal** — ABN, Pty Ltd, trademarks, employment (LegalZoom)
- **Identity Shield** — theft monitoring + restoration lawyer (LegalShield)
- **Shield Copilot** — AI assistant + legal health checkup (Rocket Lawyer)
- **Legal Vault** — secure document archive (Rocket Lawyer)
- **Court & Deadlines** — compliance calendar with SMS reminders (LegalZoom)
- **Fine Defence** — infringement review & appeals (LegalShield traffic)
- **Estate Planning** — will, POA, advance care directive (LegalZoom)
- **Legal Library** — searchable guides (LegalShield)
- **Your Law Firm** + attorney directory (LegalShield / LegalZoom)
- **Supplemental plans** — gig driver, firearms, home business (LegalShield)
- **Refer & Earn** — membership referrals
- **Ask upgrades** — fast track, second opinion, phone consult, attachments (JustAnswer)
- Shield Basic billing ($15/mo — first 15 min FREE, then per-min overage from Shield Credit)
- Digital Glovebox, emergency SMS alerts, family plan
- Know Your Rights (QLD, NSW, VIC), ATSILS links, medicinal cannabis module

## Tests

```bash
node test-shieldau.js
```

## Agora real video (E2E)

1. Create a project at [console.agora.io](https://console.agora.io) → enable **App Certificate**
2. On Render → **shieldau-api** service → Environment:
   - `AGORA_APP_ID` = your App ID
   - `AGORA_APP_CERTIFICATE` = your App Certificate
3. Client app: https://shieldau.onrender.com → start video session
4. Lawyer joins same channel: https://shieldau.onrender.com/lawyer.html?channel=CHANNEL_ID

Evidence Shield (dual camera + mic) runs locally; Agora carries live lawyer ↔ client video.

## Deploy on Render (do this first)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect repo `leaflock420-weedman/shieldau` → Render reads `render.yaml` from the repo root
3. Click **Apply** — site deploys from the `/docs` folder (free static hosting)
4. Your URL will be `https://shieldau.onrender.com` (or similar)

Every `git push` to `main` auto-redeploys.

**Android APK comes later** — once Render is live, use that URL in PWABuilder (see [APK-BUILD.md](APK-BUILD.md)).

GitHub Pages also deploys from `/docs` as a backup.

## Disclaimer

Non-functional prototype. Not legal advice. Production requires licensed lawyers, Privacy Act compliance, and Australian legal review.