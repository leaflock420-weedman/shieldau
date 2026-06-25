const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apk = 'C:/Users/wordo/Downloads/attorney_shield_extract/com.app.attorney.shield.apk';
const zip = 'C:/Users/wordo/Downloads/attorney_shield_extract/main.zip';
const out = 'C:/Users/wordo/Downloads/attorney_shield_extract/apk_contents';

fs.copyFileSync(apk, zip);
if (fs.existsSync(out)) fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
execSync(`powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip}' -DestinationPath '${out}' -Force"`, { stdio: 'inherit' });

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else console.log(path.relative(out, p).replace(/\\/g, '/'), fs.statSync(p).size);
  }
}
console.log('\n--- APK contents ---');
walk(out);