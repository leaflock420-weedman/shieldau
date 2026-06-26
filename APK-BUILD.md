# ShieldAU → Android APK

## Live site (Render — use this for APK)

https://shieldau.onrender.com

*(Backup: https://leaflock420-weedman.github.io/shieldau/index.html)*

## PWABuilder (recommended — after Render is live)

1. Open https://www.pwabuilder.com
2. Paste: `https://shieldau.onrender.com`
3. Click **Start** → review manifest score → **Package For Stores** → **Android**
4. App Name: `ShieldAU` | Package: `com.shieldau.demo` | Version: `1.0.0`
5. **Generate Package** → download APK

## Cloud API (no local Android SDK)

Use `pwabuilder-package.json` in this repo and POST to:

`https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage`

## Required files in `docs/` deploy folder

- `index.html`
- `manifest.json`
- `sw.js`
- `icons/` (48–512 px, sizes must match manifest)
- `screenshots/` (narrow + wide)

## Install on Android

1. Download `ShieldAU.apk` from [Releases](https://github.com/leaflock420-weedman/shieldau/releases)
2. Copy to phone (USB, email, or cloud)
3. Enable **Install unknown apps** for your file manager
4. Tap APK to install