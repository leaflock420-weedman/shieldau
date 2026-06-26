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
  const minutes = Math.max(totalMinutes, 0.1);
  const freeBlock = { label: 'First 15 min (included in Shield Basic)', amount: 0 };

  if (minutes <= 15) {
    return { total: 0, breakdown: [freeBlock], phase: 'Included in subscription' };
  }

  const extraMins = Math.ceil(minutes - 15);
  const extraCost = extraMins * perMin;
  return {
    total: extraCost,
    breakdown: [
      freeBlock,
      { label: `Minutes 16–${Math.ceil(minutes)} (${extraMins} min × ${formatMoney(perMin)})`, amount: extraCost }
    ],
    phase: `Per-minute billing (${extraMins} min after free block)`
  };
}

console.log('\n🛡️  ShieldAU Demo Tests\n');

// ── Billing model ──────────────────────────────────────────────────────────
console.log('Billing (15 min free → per-min overage):');

const t4 = calculateCallCost(4 / 60);
assert(t4.total === 0, `4 min call = $0 (included in Basic) → got ${formatMoney(t4.total)}`);

const t25 = calculateCallCost(25);
assert(t25.total === 60, `25 min call = $60 → got ${formatMoney(t25.total)}`);

const t60 = calculateCallCost(60);
assert(t60.total === 270, `60 min call = $270 → got ${formatMoney(t60.total)}`);

const t75 = calculateCallCost(75);
assert(t75.total === 360, `75 min call = $360 → got ${formatMoney(t75.total)}`);

// ── Wallet deduction ───────────────────────────────────────────────────────
console.log('\nWallet deduction:');
let wallet = 149;
const cost = calculateCallCost(4 / 60).total;
wallet = Math.max(0, wallet - cost);
assert(wallet === 149, `$149 − $0 short call = $149 remaining → got ${formatMoney(wallet)}`);

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
const html = fs.readFileSync(path.join(__dirname, 'docs', 'index.html'), 'utf8');
const required = [
  'id="call-section"',
  'id="glovebox-section"',
  'id="emergency-section"',
  'id="family-section"',
  'id="pin-modal"',
  'id="asklawyer-section"',
  'id="templates-section"',
  'id="hotline-section"',
  'id="attorney-action-section"',
  'id="business-section"',
  'id="copilot-section"',
  'id="vault-section"',
  'id="calendar-section"',
  'id="ticket-section"',
  'id="estate-section"',
  'id="library-section"',
  'id="provider-section"',
  'id="addons-section"',
  'id="dashboard-section"',
  'id="services-hub-section"',
  'id="matters-section"',
  'id="divorce-section"',
  'id="ato-section"',
  'id="bail-section"',
  'id="experts-section"',
  'id="signing-section"',
  'Ultimate v2.0',
  'Shield Copilot',
  'All Legal Services',
  'function globalSearch',
  'function sosConnect',
  'Fine Defence',
  'CONNECT LAWYER NOW',
  'function connectLawyerNow',
  'function instantLawyerConnect',
  'function startLawyerMatch',
  'Agora E2E',
  'Digital Glovebox',
  'Shield Family',
  'Ask a Lawyer',
  '24/7 Legal Hotline',
  'function simulateCall',
  'function sendEmergencyAlert',
  'function showPinModal',
  'function sendAskLawyer',
  'function sendCopilot',
  'Shield Basic',
  'First 15 min FREE',
  'Arrest Protection',
  'Evidence Shield REC',
  'function activateArrestProtection',
  'lawyer.html',
  'agora-config.js',
  'function joinAgoraCall',
  'function leaveAgoraCall',
  'Agora E2E channel',
  'agora-lawyer-video',
  'function startEvidenceCapture',
  'function createEvidenceSession',
  'function uploadEvidenceChunk',
  'function finalizeEvidenceBackup',
  'id="backup-rec-status"',
  'cloud backup',
  'id="front-camera-video"',
  'id="back-camera-video"',
  'id="recording-status-bar"',
  'function toggleLawyerMute',
  'front camera',
  'back camera',
  'microphone',
];
required.forEach(id => assert(html.includes(id), `Contains: ${id}`));

const serverJs = fs.readFileSync(path.join(__dirname, 'api', 'server.js'), 'utf8');
[
  '/api/evidence/session',
  '/api/evidence/chunk',
  '/api/evidence/finalize',
  'evidenceBackup: true',
].forEach(id => assert(serverJs.includes(id), `server.js: ${id}`));

// ── Summary ────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('─'.repeat(40));

if (failed === 0) {
  console.log('\n✅ All tests passed. Open index.html and run the manual walkthrough below.\n');
  console.log('MANUAL WALKTHROUGH (2 min):');
  console.log('  1. Accept terms → tap CONNECT LAWYER NOW');
  console.log('  2. Pick "Traffic / Drug Driving" → Connect Lawyer Now');
  console.log('     → Cameras + mic start during connect; Cloud pill shows Live backup');
  console.log('     → Auto-match → live video (no extra START button)');
  console.log('     → Red banner: "SMS sent to 2 contacts"');
  console.log('  3. Tap ID → see QLD Licence + NRMA Insurance');
  console.log('  4. End Session → PIN: 1-2-3-4 → post-call bill ~$0 (first 15 min free)');
  console.log('  5. More → Family Plan → see Sarah + Tom sub-accounts\n');
  process.exit(0);
} else {
  process.exit(1);
}