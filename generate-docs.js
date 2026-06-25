const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType
} = require('docx');
const pptxgen = require('pptxgenjs');

const OUT = __dirname;

// ─── Business Plan DOCX ───────────────────────────────────────────────────────

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, ...opts })],
    spacing: { after: 120 }
  });
}

function bullet(text) {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 80 } });
}

async function createBusinessPlan() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'ShieldAU', bold: true, size: 56, color: '1E3A8A' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Business Plan — June 2026', size: 28, color: '64748B' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        heading('Executive Summary'),
        para('ShieldAU is an Australian technology and referral platform that connects people experiencing police interactions with independent, qualified legal practitioners — fast. Inspired by US models like Attorney Shield, ShieldAU is built specifically for Australian law, regulatory compliance, and state-by-state rights education.'),
        para('The platform does not provide legal advice. It pre-funds lawyer access through a subscription credit model (Shield Credit), holds funds in trust, and pays panel lawyers using a transparent billing structure: first 15 minutes as a block, per-minute to 60 minutes, then hourly blocks.'),
        para('Launch focus: Queensland, with NSW and Victoria rights modules from day one. Aboriginal and Torres Strait Islander Legal Services are prominently linked — ShieldAU complements, never replaces, ATSILS.'),

        heading('Problem'),
        bullet('No near-instant lawyer connection service exists specifically for police interaction scenarios in Australia'),
        bullet('Legal Aid and community legal centres have limited after-hours and regional capacity'),
        bullet('Medicinal cannabis patients face confusing, strict drug-driving laws (especially QLD zero-tolerance)'),
        bullet('Aboriginal and Torres Strait Islander communities face disproportionate police contact with uneven access to rapid legal support'),
        bullet('People do not know their rights during high-stress police stops'),

        heading('Solution'),
        bullet('One-tap lawyer matching by issue category (traffic, criminal, complaints, cannabis, general)'),
        bullet('Subscription Shield Credit — monthly fee pre-funds lawyer payments so users never scramble for payment during a stop'),
        bullet('State-specific Know Your Rights modules (QLD, NSW, VIC) — general information only, lawyer-reviewed'),
        bullet('Secure incident documentation with optional lawyer sharing'),
        bullet('Official complaint channel guides (QPS/CCC, LECC, IBAC)'),
        bullet('Prominent ATSILS / ALS / VALS referral links'),

        heading('Regulatory & Compliance Structure'),
        para('ShieldAU Pty Ltd operates as a technology and referral service only — not a law firm.'),
        bullet('All legal advice provided solely by independent practitioners with current Australian practising certificates'),
        bullet('Educational content labelled "general information only" — never personalised advice'),
        bullet('Prominent disclaimers on every screen; users must comply with lawful police directions'),
        bullet('Privacy Act 1988 (Cth) compliance — APPs, sensitive information protections, Australia-hosted data'),
        bullet('Platform PI + public liability insurance; each panel lawyer carries own PII'),
        bullet('Formal panel agreements with established Queensland law firms (recommended lowest-risk model)'),

        heading('Revenue Model — Shield Credit Subscriptions'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [
              new TableCell({ children: [para('Plan', { bold: true })] }),
              new TableCell({ children: [para('Monthly fee', { bold: true })] }),
              new TableCell({ children: [para('Shield Credit', { bold: true })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [para('Shield Basic')] }),
              new TableCell({ children: [para('$29/mo')] }),
              new TableCell({ children: [para('$25 credit')] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [para('Shield Plus')] }),
              new TableCell({ children: [para('$49/mo')] }),
              new TableCell({ children: [para('$45 credit')] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [para('Shield Pro')] }),
              new TableCell({ children: [para('$99/mo')] }),
              new TableCell({ children: [para('$90 credit + priority')] }),
            ]}),
          ]
        }),
        para('Unused credit rolls over. Top-ups available. Platform margin = subscription fee minus credit allocated + any platform/referral fee on connections.'),

        heading('Lawyer Billing Structure'),
        bullet('First 15 minutes: charged as one block (25% of lawyer hourly rate), even if call is shorter'),
        bullet('Minutes 16–60: billed per minute at hourly rate ÷ 60'),
        bullet('After 60 minutes: billed in full hourly blocks'),
        para('Example at $360/hr: 4 min call = $90 | 25 min = $150 | 75 min = $720'),
        para('ShieldAU deducts from user Shield Credit at end of call and pays the independent lawyer from the pre-funded pool. This enables subscription economics and ensures lawyers are paid promptly.'),

        heading('Lawyer Compensation'),
        bullet('Rostered panel — lawyers sign up for shifts (evenings, weekends)'),
        bullet('Paid from Shield Credit pool after each completed call'),
        bullet('Typical urgent criminal lawyer rates: $300–$450/hr depending on seniority'),
        bullet('After-hours premium built into hourly rates'),
        para('Expect $150–$400+ effective cost per consultation depending on duration and lawyer seniority.'),

        heading('Target Market'),
        bullet('General public — moderate demand, spikes after high-profile incidents'),
        bullet('Medicinal cannabis patients — high demand in QLD, WA (strict zero-tolerance)'),
        bullet('Aboriginal & Torres Strait Islander communities — culturally appropriate rapid support (alongside ATSILS)'),
        bullet('CALD communities and young people — language barriers, rights knowledge gaps'),
        bullet('People with prior police contact — repeat demand'),
        bullet('Regional Queensland — limited after-hours legal access'),

        heading('Go-to-Market (Phase 1 — Queensland)'),
        bullet('Partner with 1–2 established Gold Coast / Brisbane criminal law firms for panel'),
        bullet('Launch MVP app with QLD rights, cannabis module, ATSILS links'),
        bullet('Marketing: "Know your rights" + "Fast lawyer access" — never "beat the system"'),
        bullet('Community partnerships: medicinal cannabis patient groups, youth legal education'),
        bullet('Phase 2: NSW/VIC panel expansion; Phase 3: national'),

        heading('Competitive Landscape'),
        bullet('Legal Aid Queensland — duty lawyers, limited scope and hours'),
        bullet('Community legal centres (Caxton, Southside) — excellent but capacity-constrained'),
        bullet('General legal apps (Lawpath, etc.) — not police-interaction focused'),
        bullet('Attorney Shield (US) — proven model, not adapted for Australian law'),
        para('Gap: No Australian service offers near-instant, police-interaction-specific lawyer connection with pre-funded subscription credit.'),

        heading('Financial Projections (Year 1 — Illustrative)'),
        bullet('Month 1–3: 200 subscribers avg $45/mo = $9,000/mo gross; 40% margin on credit pool'),
        bullet('Month 6: 800 subscribers = $36,000/mo; 120 lawyer connections/mo'),
        bullet('Month 12: 2,500 subscribers = $112,500/mo; break-even on ops + panel costs'),
        para('Initial capital required: lawyer payment float ($20–50k), platform build ($30–80k), legal/compliance ($15–25k), insurance ($5–10k/yr).'),

        heading('Risks & Mitigations'),
        bullet('Regulatory — mitigated by technology-only model, lawyer panel, legal review of all content'),
        bullet('Privacy breach — mitigated by encryption, AU hosting, minimal data collection, privacy lawyer engagement'),
        bullet('Lawyer availability — mitigated by rostered shifts, fair compensation, multiple panel firms'),
        bullet('Reputational — mitigated by transparent disclaimers, no over-promising, ATSILS partnership respect'),
        bullet('Subscription regulatory scrutiny — mitigated by clear separation: credit pays technology + lawyer referral, not "legal advice subscription"'),

        heading('Next Steps'),
        bullet('Engage Queensland commercial lawyer for platform structure review'),
        bullet('Sign MOU with pilot law firm panel (Gold Coast criminal/traffic)'),
        bullet('Privacy impact assessment and APP-compliant privacy policy'),
        bullet('Build production MVP (encrypted calls via Twilio/Vonage AU)'),
        bullet('Apply for platform PI insurance'),
        bullet('Soft launch Gold Coast — 100 beta users'),

        new Paragraph({
          children: [new TextRun({ text: '— End of Business Plan —', italics: true, size: 20, color: '94A3B8' })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 }
        }),
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(OUT, 'ShieldAU_Business_Plan.docx'), buffer);
  console.log('Created ShieldAU_Business_Plan.docx');
}

// ─── Pitch Deck PPTX ──────────────────────────────────────────────────────────

async function createPitchDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'ShieldAU';
  pres.title = 'ShieldAU Pitch Deck';

  const NAVY = '1E2761';
  const ICE = 'CADCFC';
  const WHITE = 'FFFFFF';
  const ACCENT = '3B82F6';

  function titleSlide(title, subtitle) {
    const slide = pres.addSlide();
    slide.background = { color: NAVY };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.08, fill: { color: ACCENT } });
    slide.addText(title, { x: 0.6, y: 1.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: WHITE, fontFace: 'Arial' });
    slide.addText(subtitle, { x: 0.6, y: 3.2, w: 8.8, h: 0.8, fontSize: 18, color: ICE, fontFace: 'Arial' });
    return slide;
  }

  function contentSlide(title, bullets) {
    const slide = pres.addSlide();
    slide.background = { color: WHITE };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: NAVY } });
    slide.addText(title, { x: 0.5, y: 0.35, w: 9, h: 0.7, fontSize: 28, bold: true, color: NAVY, fontFace: 'Arial' });
    const items = bullets.map(b => ({ text: b, options: { bullet: true, breakLine: true, fontSize: 14, color: '334155' } }));
    slide.addText(items, { x: 0.5, y: 1.2, w: 9, h: 4, fontFace: 'Arial', valign: 'top' });
    return slide;
  }

  titleSlide('ShieldAU', 'Instant lawyer access during police interactions\nAustralia\'s compliant legal connection platform — June 2026');

  contentSlide('The Problem', [
    'No Australian app offers near-instant lawyer connection during police stops',
    'Legal Aid & community centres: limited after-hours, especially regional QLD',
    'Medicinal cannabis patients face harsh, confusing drug-driving laws',
    'ATSILS provides critical free help — but demand exceeds capacity in peak periods',
    'People don\'t know their rights when it matters most',
  ]);

  contentSlide('Our Solution', [
    'Technology & referral platform — connects users to independent qualified lawyers',
    'One-tap matching by issue: traffic, criminal, complaints, cannabis, general',
    'Shield Credit subscription — pre-funded pool pays lawyers, no payment panic during stops',
    'State rights modules: QLD, NSW, VIC (general information only)',
    'Incident documentation + official complaint guides + ATSILS links',
  ]);

  contentSlide('How It Works', [
    '1. User subscribes → Shield Credit deposited monthly',
    '2. Police interaction → tap Connect → select category',
    '3. Matched to available panel lawyer in < 2 minutes',
    '4. Secure encrypted call — lawyer provides advice (not ShieldAU)',
    '5. Credit deducted: 15-min block → per min → hourly after 60 min',
    '6. ShieldAU pays lawyer from pre-funded pool',
  ]);

  contentSlide('Billing Model', [
    'First 15 min: minimum block (25% of hourly rate) — e.g. $90 at $360/hr',
    'Min 16–60: per minute at hourly ÷ 60 — e.g. $6/min',
    'After 60 min: full hourly blocks — e.g. $360/hr',
    'Subscriptions: Basic $29 → $25 credit | Plus $49 → $45 | Pro $99 → $90',
    'Unused credit rolls over — platform holds float to pay lawyers promptly',
  ]);

  contentSlide('Regulatory Compliance', [
    'ShieldAU is NOT a law firm — technology & referral only',
    'Independent lawyers with practising certificates provide all legal advice',
    'All content: "general information only" — lawyer-reviewed, regularly updated',
    'Privacy Act 1988 (APPs), Australia-hosted encrypted data',
    'Platform PI + lawyer PII; formal panel agreements with established firms',
    'Prominent disclaimers: comply with lawful police directions',
  ]);

  contentSlide('Market Opportunity', [
    'Medicinal cannabis: 500k+ Australian patients, strict driving laws in QLD/WA',
    'Aboriginal & Torres Strait Islander people: highest police contact rates nationally',
    'Regional QLD: major gap in after-hours criminal law access',
    'US Attorney Shield proves demand for police-interaction legal tech',
    'No direct Australian competitor in this niche',
  ]);

  contentSlide('Go-to-Market — Phase 1 QLD', [
    'Partner with Gold Coast / Brisbane criminal law firms for lawyer panel',
    'Launch MVP: QLD focus + NSW/VIC rights + ATSILS integration',
    'Beta: 100 users Gold Coast — medicinal cannabis + general public',
    'Marketing: "Know your rights" / "Lawyer in minutes" — never over-promise',
    'Phase 2: Sydney & Melbourne panels; Phase 3: national',
  ]);

  contentSlide('Financials — Year 1 Target', [
    'Month 6: 800 subscribers × ~$45 avg = $36k/mo revenue',
    'Month 12: 2,500 subscribers = $112k/mo revenue',
    'Lawyer connections: ~120/mo by month 6, ~400/mo by month 12',
    'Initial capital need: $70–150k (float, build, legal, insurance)',
    'Break-even: month 10–14 at projected growth',
  ]);

  const lastSlide = pres.addSlide();
  lastSlide.background = { color: NAVY };
  lastSlide.addText('ShieldAU', { x: 0.6, y: 1.5, w: 8.8, h: 1, fontSize: 44, bold: true, color: WHITE, fontFace: 'Arial' });
  lastSlide.addText('Know your rights. Get a lawyer. Stay compliant.', { x: 0.6, y: 2.8, w: 8.8, h: 0.6, fontSize: 20, color: ICE, fontFace: 'Arial' });
  lastSlide.addText('demo@shieldau.com.au  •  Gold Coast, QLD  •  June 2026', { x: 0.6, y: 4.2, w: 8.8, h: 0.5, fontSize: 14, color: ICE, fontFace: 'Arial' });

  await pres.writeFile({ fileName: path.join(OUT, 'ShieldAU_Pitch_Deck.pptx') });
  console.log('Created ShieldAU_Pitch_Deck.pptx');
}

(async () => {
  await createBusinessPlan();
  await createPitchDeck();
})();