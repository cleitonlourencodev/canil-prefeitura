// api/_db.js
// Camada de persistencia do Canil: SQLite local via better-sqlite3, sem servico externo.
// O arquivo do banco fica em db/canil.sqlite e pode ser versionado no GitHub.
//
// Tabelas:
//   app_storage -> pares chave/valor JSON (mesmo contrato usado pelo front-end)
//   uploads     -> registro dos arquivos enviados pelo painel do sistema
//
// Usa better-sqlite3 (binario nativo linux-x64) para funcionar tambem no Node 20
// do Vercel, onde node:sqlite nao existe (exigencia Node 22.5+).

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const Database = require('better-sqlite3');

const ROOT = path.resolve(__dirname, '..');
const DB_DIR = path.join(ROOT, 'db');
const DB_PATH = process.env.CANIL_DB_PATH || path.join(DB_DIR, 'canil.sqlite');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const SEGREDOS_PATH = path.join(DB_DIR, '.segredo-local');

const CHAVES = {
  animais: 'pv_animais',
  blog: 'pv_blog_posts',
  denuncias: 'pv_denuncias',
  interesses: 'pv_interesses_adocao',
  usuarios: 'pv_usuarios',
  auditoria: 'pv_auditoria_logs',
  metaSeed: 'pv_meta_seed',
};

const LIMITE_CORPO = 6 * 1024 * 1024; // 6 MB por arquivo
const VALIDADE_TOKEN_SEGUNDOS = 60 * 60 * 8; // 8 horas

const CHAVES_PROTEGIDAS = new Set([CHAVES.usuarios]);

let db = null;

function getDb() {
  if (db) return db;

  const readOnly = process.env.VERCEL === '1';

  if (readOnly) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  } else {
    fs.mkdirSync(DB_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');

    db.exec(`
      CREATE TABLE IF NOT EXISTS app_storage (
        chave       TEXT PRIMARY KEY,
        valor       TEXT NOT NULL DEFAULT '',
        criado_em   TEXT NOT NULL DEFAULT (datetime('now')),
        atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS uploads (
        id           TEXT PRIMARY KEY,
        pasta        TEXT NOT NULL,
        arquivo      TEXT NOT NULL,
        caminho      TEXT NOT NULL,
        content_type TEXT,
        tamanho      INTEGER NOT NULL DEFAULT 0,
        enviado_por  TEXT,
        criado_em    TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_uploads_pasta ON uploads(pasta);
    `);
  }

  return db;
}

// ─── app_storage ────────────────────────────────────────────────────────────

function lerTudo() {
  const linhas = getDb().prepare('SELECT chave, valor FROM app_storage').all();
  return Object.fromEntries(linhas.map((linha) => [linha.chave, linha.valor]));
}

function ler(chave) {
  const linha = getDb()
    .prepare('SELECT valor FROM app_storage WHERE chave = ?')
    .get(String(chave));
  return linha ? linha.valor : null;
}

function gravar(chave, valor) {
  getDb()
    .prepare(
      `INSERT INTO app_storage (chave, valor, criado_em, atualizado_em)
       VALUES (?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizado_em = datetime('now')`,
    )
    .run(String(chave), String(valor ?? ''));
}

function gravarLote(itens) {
  const conexao = getDb();
  conexao.exec('BEGIN');
  try {
    for (const { chave, valor } of itens) gravar(chave, valor);
    conexao.exec('COMMIT');
  } catch (erro) {
    conexao.exec('ROLLBACK');
    throw erro;
  }
}

function remover(chave) {
  const resultado = getDb().prepare('DELETE FROM app_storage WHERE chave = ?').run(String(chave));
  return Number(resultado.changes) > 0;
}

// ─── uploads ────────────────────────────────────────────────────────────────

function registrarUpload({ pasta, arquivo, caminho, contentType, tamanho, enviadoPor }) {
  const id = `upl-${crypto.randomUUID()}`;
  getDb()
    .prepare(
      `INSERT INTO uploads (id, pasta, arquivo, caminho, content_type, tamanho, enviado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      String(pasta || ''),
      String(arquivo || ''),
      String(caminho || ''),
      String(contentType || ''),
      Number(tamanho || 0),
      String(enviadoPor || ''),
    );
  return id;
}

function caminhoRelativoUpload(caminho) {
  return `/${path.relative(ROOT, caminho).split(path.sep).join('/')}`;
}

// ─── Autenticacao (JWT HS256 sem dependencia externa) ───────────────────────

function base64url(dado) {
  return Buffer.from(dado).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlTexto(texto) {
  return base64url(texto);
}

function fromBase64url(texto) {
  const normalizado = String(texto).replace(/-/g, '+').replace(/_/g, '/');
  const preenchimento = normalizado.length % 4 === 0 ? '' : '='.repeat(4 - (normalizado.length % 4));
  return Buffer.from(normalizado + preenchimento, 'base64');
}

function segredoLocal() {
  if (process.env.CANIL_JWT_SECRET) return process.env.CANIL_JWT_SECRET;

  try {
    return fs.readFileSync(SEGREDOS_PATH, 'utf8').trim();
  } catch {
    fs.mkdirSync(DB_DIR, { recursive: true });
    const segredo = crypto.randomBytes(48).toString('hex');
    fs.writeFileSync(SEGREDOS_PATH, `${segredo}\n`, { mode: 0o600 });
    return segredo;
  }
}

function assinar(algoritmo, dados, segredo) {
  return crypto.createHmac('sha256', segredo).update(`${algoritmo}.${dados}`).digest();
}

function gerarToken(payload) {
  const cabecalho = base64urlTexto(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const corpo = base64urlTexto(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + VALIDADE_TOKEN_SEGUNDOS,
    }),
  );
  const assinatura = base64url(assinar(cabecalho, corpo, segredoLocal()));
  return `${cabecalho}.${corpo}.${assinatura}`;
}

function verificarToken(token) {
  if (!token) return null;

  const partes = String(token).split('.');
  if (partes.length !== 3) return null;

  const [cabecalho, corpo, assinatura] = partes;
  const esperada = base64url(assinar(cabecalho, corpo, segredoLocal()));
  const bufferA = Buffer.from(assinatura);
  const bufferB = Buffer.from(esperada);
  if (bufferA.length !== bufferB.length || !crypto.timingSafeEqual(bufferA, bufferB)) return null;

  try {
    const payload = JSON.parse(fromBase64url(corpo).toString('utf8'));
    if (!payload?.exp || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function extrairToken(req) {
  const cabecalho = req.headers?.authorization || req.headers?.Authorization || '';
  if (typeof cabecalho === 'string' && /^bearer\s+/i.test(cabecalho)) {
    return cabecalho.replace(/^bearer\s+/i, '').trim();
  }
  return null;
}

function usuarioDoToken(req) {
  const payload = verificarToken(extrairToken(req));
  return payload ? { id: payload.sub, nome: payload.nome, login: payload.login, perfil: payload.perfil } : null;
}

// ─── Utilidades de request/response ─────────────────────────────────────────

async function readRawBody(req) {
  if (req.rawBody !== undefined) return req.rawBody;

  const partes = [];
  let total = 0;

  for await (const parte of req) {
    total += parte.length;
    if (total > LIMITE_CORPO) {
      const erro = new Error('Arquivo excede o limite de 6 MB.');
      erro.statusCode = 413;
      throw erro;
    }
    partes.push(parte);
  }

  req.rawBody = Buffer.concat(partes);
  return req.rawBody;
}

async function readJsonBody(req) {
  if (req.jsonBody !== undefined) return req.jsonBody;

  const bruto = await readRawBody(req);
  if (!bruto.length) {
    req.jsonBody = {};
    return req.jsonBody;
  }

  try {
    req.jsonBody = JSON.parse(bruto.toString('utf8'));
  } catch {
    const erro = new Error('Corpo da requisição não é um JSON válido.');
    erro.statusCode = 400;
    throw erro;
  }
  return req.jsonBody;
}

function sanitizeFileName(nome) {
  return path
    .basename(String(nome || ''))
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function garantirPastaUpload(pasta) {
  const segura = String(pasta || '').replace(/[^\w-]+/g, '') || 'geral';
  const destino = path.join(UPLOADS_DIR, segura);
  fs.mkdirSync(destino, { recursive: true });
  return { nome: segura, caminho: destino };
}

module.exports = {
  CHAVES,
  CHAVES_PROTEGIDAS,
  DB_PATH,
  ROOT,
  UPLOADS_DIR,
  getDb,
  lerTudo,
  ler,
  gravar,
  gravarLote,
  remover,
  registrarUpload,
  caminhoRelativoUpload,
  gerarToken,
  verificarToken,
  extrairToken,
  usuarioDoToken,
  readRawBody,
  readJsonBody,
  sanitizeFileName,
  garantirPastaUpload,
  segredoLocal,
};