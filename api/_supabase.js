const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

function getSupabaseAdmin() {
  return createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'canil-assets';
}

function sanitizeFileName(fileName) {
  const normalized = String(fileName || 'arquivo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'arquivo';
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = {
  getSupabaseAdmin,
  getStorageBucket,
  sanitizeFileName,
  readRawBody,
  gerarToken,
  verificarToken,
  extrairToken,
};

// ─── JWT helpers ────────────────────────────────────────────

function gerarToken(usuario) {
  let secret = process.env.JWT_SECRET;
  
  // Se JWT_SECRET não definido, deriva de SUPABASE_SERVICE_ROLE_KEY
  if (!secret) {
    try {
      const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
      secret = crypto.createHash('sha256').update(key).digest('hex');
    } catch {
      throw new Error('JWT_SECRET não configurado e SUPABASE_SERVICE_ROLE_KEY indisponível.');
    }
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const agora = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: String(usuario.id),
    login: String(usuario.login),
    nome: String(usuario.nome),
    perfil: String(usuario.perfil),
    iat: agora,
    exp: agora + 8 * 3600, // 8 horas
  })).toString('base64url');

  const assinatura = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${assinatura}`;
}

function verificarToken(token) {
  let secret = process.env.JWT_SECRET;
  
  // Se JWT_SECRET não definido, deriva de SUPABASE_SERVICE_ROLE_KEY
  if (!secret) {
    try {
      const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
      secret = crypto.createHash('sha256').update(key).digest('hex');
    } catch {
      return null;
    }
  }

  if (!token) return null;

  const partes = String(token).split('.');
  if (partes.length !== 3) return null;

  const [header, payload, assinatura] = partes;
  const esperada = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  const bufA = Buffer.from(assinatura);
  const bufB = Buffer.from(esperada);
  if (bufA.length !== bufB.length) return null;

  try {
    if (!crypto.timingSafeEqual(bufA, bufB)) return null;
  } catch {
    return null;
  }

  try {
    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (dados.exp < Math.floor(Date.now() / 1000)) return null;
    return dados;
  } catch {
    return null;
  }
}

function extrairToken(req) {
  const auth = String(req.headers.authorization || '');
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}
