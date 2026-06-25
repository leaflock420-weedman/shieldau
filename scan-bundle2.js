const fs = require('fs');
const text = fs.readFileSync('C:/Users/wordo/Downloads/attorney_shield_extract/apk_contents/assets/index.android.bundle', 'latin1');

const patterns = [
  /attorney[- ]?shield/gi,
  /digital[\s_-]?glovebox/gi,
  /member protection/gi,
  /emergency alert/gi,
  /family plan/gi,
  /sub-?account/gi,
  /traffic stop/gi,
  /legal first responder/gi,
  /pin to end/gi,
  /warranty/gi,
  /CurrentCoverageHours/gi,
  /CategoryCard/gi,
  /call token/gi,
  /agora/gi,
  /twilio/gi,
  /stripe/gi,
  /codepush/gi,
  /picture.in.picture/gi,
  /recorded/gi,
  /glovebox/gi,
  /coverage hours/gi,
];

for (const p of patterns) {
  const m = text.match(p);
  if (m) console.log(p.source, '→', m.length, 'hits');
}

// Pull quoted strings containing key terms
const re = /["'`]((?:[^"'\\]|\\.){5,120})["'`]/g;
const found = new Set();
let match;
while ((match = re.exec(text)) !== null) {
  const s = match[1];
  if (/attorney|shield|lawyer|police|member|glovebox|emergency|warranty|traffic|encounter|coverage|family|video|record|location|document|plan|subscription|call|legal/i.test(s)) {
    found.add(s.replace(/\\n/g, ' ').replace(/\\"/g, '"'));
  }
}
console.log('\nQuoted strings (' + found.size + '):');
[...found].sort().forEach(s => console.log(' -', s));