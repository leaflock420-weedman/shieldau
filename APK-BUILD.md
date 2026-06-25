# ShieldAU → Android APK

## Quick path (already hosted on GitHub Pages)

1. Open https://www.pwabuilder.com
2. Paste: `https://leaflock420-weedman.github.io/shieldau/index.html`
3. Click **Start** → **Android** tab
4. App Name: `ShieldAU` | Package: `com.shieldau.demo` | Version: `1.0.0`
5. **Generate Package** → download APK

## Netlify Drop (alternative)

1. Go to https://app.netlify.com/drop
2. Drag the `docs` folder (not the whole repo)
3. Copy the Netlify URL → paste into PWABuilder

## Required files in deploy folder

- `index.html`
- `manifest.json`
- `sw.js` (service worker for PWA)

## Install on Android

1. Copy `.apk` to phone
2. Enable **Install unknown apps** for your file manager
3. Tap APK to install