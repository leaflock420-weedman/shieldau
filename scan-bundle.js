const fs = require('fs');
const buf = fs.readFileSync('C:/Users/wordo/Downloads/attorney_shield_extract/apk_contents/assets/index.android.bundle');

// Extract readable phrases (letters, spaces, punctuation)
const phrases = new Set();
let cur = '';
for (let i = 0; i < buf.length; i++) {
  const b = buf[i];
  const ok = (b >= 32 && b <= 126);
  if (ok) cur += String.fromCharCode(b);
  else {
    if (cur.length >= 8 && /[a-zA-Z]{3}/.test(cur) && (cur.includes(' ') || cur.length > 20)) {
      phrases.add(cur);
    }
    cur = '';
  }
}

const kw = /attorney|shield|lawyer|legal|police|member|subscription|plan|emergency|rights|incident|protect|connect|call|video|audio|location|state|traffic|dui|dwai|arrest|ticket|citation|bail|custody|officer|document|record|sos|panic|membership|coverage|hotline|advice|counsel/i;

const hits = [...phrases].filter(p => kw.test(p)).sort();
console.log('Bundle UI/feature strings:', hits.length);
hits.forEach(h => console.log(h));

// Also find API URLs
const urls = [...phrases].filter(p => /https?:\/\//.test(p) || /\.(com|io|net|org)\//.test(p)).sort();
console.log('\nURLs/domains:', urls.length);
urls.slice(0, 80).forEach(u => console.log(u));