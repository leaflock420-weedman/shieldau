const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = 'C:/Users/wordo/Downloads/Attorney+Shield_5.0_APKPure.xapk';
const zip = 'C:/Users/wordo/Downloads/attorney_shield.zip';
const out = 'C:/Users/wordo/Downloads/attorney_shield_extract';

fs.copyFileSync(src, zip);
fs.mkdirSync(out, { recursive: true });
execSync(`powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip}' -DestinationPath '${out}' -Force"`, { stdio: 'inherit' });

function walk(dir, depth = 0) {
  if (depth > 4) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, depth + 1);
    else console.log(p.replace(/\\/g, '/'), st.size);
  }
}
walk(out);