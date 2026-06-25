const fs = require('fs');
const path = require('path');

const apkDir = 'C:/Users/wordo/Downloads/attorney_shield_extract/apk_contents';

function extractStrings(buf, minLen = 4) {
  const results = new Set();
  let current = '';
  for (let i = 0; i < buf.length; i++) {
    const c = buf[i];
    if (c >= 32 && c <= 126) current += String.fromCharCode(c);
    else {
      if (current.length >= minLen) results.add(current);
      current = '';
    }
  }
  if (current.length >= minLen) results.add(current);
  return [...results];
}

const keywords = /lawyer|attorney|shield|police|call|emergency|rights|member|subscription|plan|video|audio|location|incident|protect|legal|connect|sos|panic|record|document|state|traffic|dui|dwai|arrest/i;

const hits = [];

function scanFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const strings = extractStrings(buf, 5);
  for (const s of strings) {
    if (keywords.test(s) && s.length < 200) {
      hits.push({ file: path.relative(apkDir, filePath), text: s });
    }
  }
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(dex|xml|json|js|html|txt|properties|bundle)$/i.test(f) || f === 'resources.arsc') {
      try { scanFile(p); } catch (e) {}
    }
  }
}

walk(apkDir);

// Dedupe and sort
const seen = new Set();
const unique = hits.filter(h => {
  const k = h.text;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
}).sort((a, b) => a.text.localeCompare(b.text));

console.log(`Found ${unique.length} relevant strings:\n`);
unique.slice(0, 150).forEach(h => console.log(`[${h.file}] ${h.text}`));

// Also dump assets listing
const assetsDir = path.join(apkDir, 'assets');
if (fs.existsSync(assetsDir)) {
  console.log('\n--- Assets tree ---');
  function tree(d, indent = '') {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      console.log(indent + f + (fs.statSync(p).isDirectory() ? '/' : ''));
      if (fs.statSync(p).isDirectory()) tree(p, indent + '  ');
    }
  }
  tree(assetsDir);
}