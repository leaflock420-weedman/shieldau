import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, '..', 'docs');

const app = express();
const PORT = process.env.PORT || 8787;

const APP_ID = process.env.AGORA_APP_ID || '';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

app.use(cors({
  origin(origin, callback) {
    callback(null, true);
  },
}));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    agoraConfigured: Boolean(APP_ID && APP_CERTIFICATE),
    hasAppId: Boolean(APP_ID),
  });
});

app.get('/api/agora/config', (_req, res) => {
  if (!APP_ID) {
    return res.status(503).json({ error: 'AGORA_APP_ID not configured — add in Render Environment' });
  }
  res.json({ appId: APP_ID });
});

app.get('/api/agora/token', (req, res) => {
  if (!APP_ID || !APP_CERTIFICATE) {
    return res.status(503).json({
      error: 'Agora not configured',
      hint: 'Set AGORA_APP_ID and AGORA_APP_CERTIFICATE on Render → shieldau → Environment',
    });
  }

  const channel = String(req.query.channel || '').trim();
  if (!channel || channel.length > 64) {
    return res.status(400).json({ error: 'channel query param required (max 64 chars)' });
  }

  const uid = parseInt(req.query.uid, 10) || 0;
  const roleName = String(req.query.role || 'publisher').toLowerCase();
  const role = roleName === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
  const ttl = Math.min(parseInt(req.query.ttl, 10) || 3600, 86400);
  const now = Math.floor(Date.now() / 1000);
  const expire = now + ttl;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channel,
      uid,
      role,
      expire,
      expire
    );
    res.json({ token, appId: APP_ID, channel, uid, expire });
  } catch (err) {
    console.error('Token error:', err);
    res.status(500).json({ error: 'Failed to build Agora token' });
  }
});

app.use(express.static(DOCS_DIR, {
  index: 'index.html',
  setHeaders(res, filePath) {
    if (filePath.endsWith('sw.js') || filePath.endsWith('manifest.json')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

app.listen(PORT, () => {
  console.log(`ShieldAU on :${PORT} | static: ${DOCS_DIR} | Agora: ${APP_ID ? 'yes' : 'MISSING'}`);
});