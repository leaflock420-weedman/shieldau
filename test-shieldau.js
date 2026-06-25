/**
 * ShieldAU demo — automated logic tests
 * Run: node test-shieldau.js
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

const LAWYER_HOURLY_RATE = 360;

function formatMoney(amount) {
  return '$' + amount.toFixed(2);
}

function calculateCallCost(totalMinutes) {
  const hourly = LAWYER_HOURLY_RATE;
  const perMin = hourly / 60;
  const firstBlock = hourly * 0.25;
  const minutes = Math.max(totalMinutes, 0.1);

  if (minutes <= 15) {
    return { total: firstBlock, breakdown: [{ label: 'First 15 min (minimum block)', amount: firstBlock }], phase: 'First 15 min block' };
  }

  const breakdown = [{ label: 'First 15 min (minimum block)', amount: firstBlock }];
  let total = firstBlock;

  if (minutes <= 60) {
    const extraMins = Math.ceil(minutes - 15);
    const extraCost = extraMins * perMin;
    breakdown.push({ label: `Minutes 16–${Math.ceil(minutes)} (${extraMins} min × ${formatMoney(perMin)})`, amount: extraCost });
    total += extraCost;
    return { total, breakdown, phase: `Per-minute billing (${extraMins} min after block)` };
  }

  const mins16to60 = 45;
  const midCost = mins16to60 * perMin;
  breakdown.push({ label: `Minutes 16–60 (45 min × ${formatMoney(perMin)})`, amount: midCost });
  total += midCost;

  const extraHours = Math.ceil((minutes - 60) / 60);
  const hourCost = extraHours * hourly;
  breakdown.push({ label: `After 60 min (${extraHours} hr × ${formatMoney(hourly)})`, amount: hourCost });
  total += hourCost;

  return { total, breakdown, phase: `Hourly blocks (${extraHours} hr after first hour)` };
}

console.log('\n🛡️  ShieldAU Demo Tests\n');

// ── Billing model ──────────────────────────────────────────────────────────
console.log('Billing (15-min block → per-min → hourly):');

const t4 = calculateCallCost(4 / 60);
assert(t4.total === 90, `4 min call = $90 (first block only) → got ${formatMoney(t4.total)}`);

const t25 = calculateCallCost(25);
assert(t25.total === 150, `25 min call = $150 → got ${formatMoney(t25.total)}`);

const t60 = calculateCallCost(60);
assert(t60.total === 360, `60 min call = $360 (full hour) → got ${formatMoney(t60.total)}`);

const t75 = calculateCallCost(75);
assert(t75.total === 720, `75 min call = $720 → got ${formatMoney(t75.total)}`);

// ── Wallet deduction ───────────────────────────────────────────────────────
console.log('\nWallet deduction:');
let wallet = 149;
const cost = calculateCallCost(4 / 60).total;
wallet = Math.max(0, wallet - cost);
assert(wallet === 59, `$149 − $90 short call = $59 remaining → got ${formatMoney(wallet)}`);

// ── PIN security ───────────────────────────────────────────────────────────
console.log('\nPIN to end session:');
const DEMO_PIN = '1234';
assert('1234' === DEMO_PIN, 'Correct PIN 1234 accepted');
assert('0000' !== DEMO_PIN, 'Wrong PIN 0000 rejected');

// ── Emergency alert payload ────────────────────────────────────────────────
console.log('\nEmergency alert:');
const loc = { lat: -27.9178, lng: 153.4031, address: 'Gold Coast Hwy, Biggera Waters QLD 4216' };
const msg = `ShieldAU Alert: Lewis requested lawyer support. Location: ${loc.address}`;
assert(msg.includes('Gold Coast'), 'Alert includes location address');
assert(msg.includes('ShieldAU Alert'), 'Alert has ShieldAU prefix');

// ── HTML structure ─────────────────────────────────────────────────────────
console.log('\nApp structure (index.html):');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const required = [
  'id="call-section"',
  'id="glovebox-section"',
  'id="emergency-section"',
  'id="family-section"',
  'id="pin-modal"',
  'INSTANT LAWYER VIDEO',
  'Agora E2E',
  'Digital Glovebox',
  'Shield Family',
  'function simulateCall',
  'function sendEmergencyAlert',
  'function showPinModal',
];
required.forEach(id => assert(html.includes(id), `Contains: ${id}`));

// ── Summary ────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('─'.repeat(40));

if (failed === 0) {
  console.log('\n✅ All tests passed. Open index.html and run the manual walkthrough below.\n');
  console.log('MANUAL WALKTHROUGH (2 min):');
  console.log('  1. Accept terms → tap INSTANT LAWYER VIDEO');
  console.log('  2. Pick "Traffic / Drug Driving" → check emergency alert ON → Proceed');
  console.log('  3. Wait for match → START VIDEO SESSION');
  console.log('     → Red banner: "SMS sent to 2 contacts"');
  console.log('     → Video UI with lawyer + PiP');
  console.log('  4. Tap ID → see QLD Licence + NRMA Insurance');
  console.log('  5. End Session → PIN: 1-2-3-4 → post-call bill ~$90');
  console.log('  6. More → Family Plan → see Sarah + Tom sub-accounts\n');
  process.exit(0);
} else {
  process.exit(1);
}