import express from 'express';
import cors from 'cors';
import path from 'path';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const EVIDENCE_DIR = path.join(__dirname, 'evidence');

const app = express();
const PORT = process.env.PORT || 8787;

const APP_ID = process.env.AGORA_APP_ID || '';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

app.use(cors({
  origin(origin, callback) {
    callback(null, true);
  },
}));

app.use(express.json({ limit: '1mb' }));

async function readEvidenceMeta(sessionId) {
  const metaPath = path.join(EVIDENCE_DIR, sessionId, 'meta.json');
  if (!existsSync(metaPath)) return null;
  return JSON.parse(await readFile(metaPath, 'utf8'));
}

async function writeEvidenceMeta(sessionId, meta) {
  const dir = path.join(EVIDENCE_DIR, sessionId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2));
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    agoraConfigured: Boolean(APP_ID && APP_CERTIFICATE),
    hasAppId: Boolean(APP_ID),
    evidenceBackup: true,
  });
});

app.post('/api/evidence/session', async (req, res) => {
  try {
    const sessionId = `ev-${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const meta = {
      sessionId,
      createdAt: new Date().toISOString(),
      channel: req.body?.channel || null,
      category: req.body?.category || null,
      status: 'recording',
      streams: { front: { chunks: 0, bytes: 0 }, back: { chunks: 0, bytes: 0 } },
    };
    await writeEvidenceMeta(sessionId, meta);
    res.json({ ok: true, sessionId });
  } catch (err) {
    console.error('Evidence session error:', err);
    res.status(500).json({ error: 'Failed to create evidence session' });
  }
});

app.post(
  '/api/evidence/chunk',
  express.raw({ limit: '15mb', type: 'application/octet-stream' }),
  async (req, res) => {
    const sessionId = String(req.headers['x-session-id'] || '').trim();
    const stream = String(req.headers['x-stream'] || '').trim();
    const seq = parseInt(req.headers['x-seq'], 10) || 0;

    if (!sessionId || !['front', 'back'].includes(stream)) {
      return res.status(400).json({ error: 'x-session-id and x-stream (front|back) required' });
    }
    if (!req.body?.length) {
      return res.status(400).json({ error: 'Empty chunk body' });
    }

    try {
      const meta = await readEvidenceMeta(sessionId);
      if (!meta) return res.status(404).json({ error: 'Session not found' });

      const streamDir = path.join(EVIDENCE_DIR, sessionId, stream);
      await mkdir(streamDir, { recursive: true });
      const filename = `${String(seq).padStart(6, '0')}.webm`;
      await writeFile(path.join(streamDir, filename), req.body);

      meta.streams[stream].chunks += 1;
      meta.streams[stream].bytes += req.body.length;
      meta.lastChunkAt = new Date().toISOString();
      await writeEvidenceMeta(sessionId, meta);

      res.json({ ok: true, sessionId, stream, seq, bytes: req.body.length });
    } catch (err) {
      console.error('Evidence chunk error:', err);
      res.status(500).json({ error: 'Failed to store evidence chunk' });
    }
  }
);

app.post('/api/evidence/finalize', async (req, res) => {
  const sessionId = String(req.body?.sessionId || '').trim();
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const meta = await readEvidenceMeta(sessionId);
    if (!meta) return res.status(404).json({ error: 'Session not found' });

    meta.status = 'finalized';
    meta.finalizedAt = new Date().toISOString();
    meta.duration = req.body?.duration || null;
    meta.channel = req.body?.channel || meta.channel;
    meta.arrest = Boolean(req.body?.arrest);
    meta.clientSummary = {
      frontChunks: req.body?.frontChunks ?? meta.streams.front.chunks,
      backChunks: req.body?.backChunks ?? meta.streams.back.chunks,
      mic: Boolean(req.body?.mic),
    };
    await writeEvidenceMeta(sessionId, meta);
    res.json({ ok: true, sessionId, streams: meta.streams });
  } catch (err) {
    console.error('Evidence finalize error:', err);
    res.status(500).json({ error: 'Failed to finalize evidence session' });
  }
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