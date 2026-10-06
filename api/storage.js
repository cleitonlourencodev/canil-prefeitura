// api/storage.js
// Persistencia chave/valor usada pelo front-end (app_storage no SQLite).
// Leitura e sempre liberada; escrita exige sessao, exceto para as chaves
// publicas preenchidas pelo proprio site (interesses e denuncias).

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Database = require('better-sqlite3');

const {
  CHAVES,
  CHAVES_PROTEGIDAS,
  lerTudo,
  ler,
  gravar,
  remover,
  readJsonBody,
  usuarioDoToken,
} = require('./_db');
const { PETS, POSTS, INTERESSES, DENUNCIAS, USUARIOS, AUDITORIA } = require('./_seed');

const DADOS_INICIAIS = {
  [CHAVES.animais]: PETS,
  [CHAVES.blog]: POSTS,
  [CHAVES.interesses]: INTERESSES,
  [CHAVES.denuncias]: DENUNCIAS,
  [CHAVES.usuarios]: USUARIOS,
  [CHAVES.auditoria]: AUDITORIA,
};

const VALORES_INICIAIS = Object.fromEntries(
  Object.entries(DADOS_INICIAIS).map(([chave, valor]) => [chave, JSON.stringify(valor)]),
);

const GITHUB_DATABASE_URL =
  'https://raw.githubusercontent.com/cleitonlourencodev/canil-prefeitura/main/db/canil.sqlite';
const CHAVES_PUBLICAS = new Set([
  'pv_interesses_adocao',
  'pv_denuncias',
  'pv_auditoria_logs',
]);

let snapshotGithub;
let snapshotGithubAt = 0;

async function lerSnapshotGithub() {
  if (snapshotGithub && Date.now() - snapshotGithubAt < 60000) return snapshotGithub;

  const resposta = await fetch(GITHUB_DATABASE_URL, { signal: AbortSignal.timeout(10000) });
  if (!resposta.ok) {
    throw new Error(`GitHub respondeu ${resposta.status} ao buscar o banco de dados.`);
  }

  const arquivo = path.join(os.tmpdir(), `canil-github-${crypto.randomUUID()}.sqlite`);
  let banco;
  try {
    fs.writeFileSync(arquivo, Buffer.from(await resposta.arrayBuffer()), { mode: 0o600 });
    banco = new Database(arquivo, { readonly: true, fileMustExist: true });
    const linhas = banco.prepare('SELECT chave, valor FROM app_storage').all();
    const dados = Object.fromEntries(linhas.map(({ chave, valor }) => [chave, valor]));

    if (!Object.keys(dados).length) {
      throw new Error('O banco de dados versionado no GitHub não contém registros.');
    }

    snapshotGithub = dados;
    snapshotGithubAt = Date.now();
    return snapshotGithub;
  } finally {
    if (banco) banco.close();
    fs.rmSync(arquivo, { force: true });
  }
}

function semSenhas(valor) {
  const dados = JSON.parse(valor);
  if (!Array.isArray(dados)) return valor;

  const seguro = dados.map((usuario) => {
    const copia = { ...usuario };
    delete copia.senhaHash;
    return copia;
  });

  return JSON.stringify(seguro);
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    let tudo = {};
    try {
      tudo = lerTudo();
    } catch {
      // O deploy somente-leitura pode nao incluir um SQLite inicializado.
    }

    try {
      tudo = { ...(await lerSnapshotGithub()), ...tudo };
    } catch (erro) {
      console.error('[Canil] Falha ao carregar snapshot do GitHub:', erro.message || erro);
    }

    for (const [chave, valor] of Object.entries(VALORES_INICIAIS)) {
      if (!tudo[chave]) tudo[chave] = valor;
    }

    const itens = {};
    for (const [chave, valor] of Object.entries(tudo)) {
      if (CHAVES_PROTEGIDAS.has(chave)) {
        try {
          itens[chave] = semSenhas(valor);
          continue;
        } catch {
          itens[chave] = '[]';
          continue;
        }
      }
      itens[chave] = valor;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, items: itens }));
    return;
  }

  if (req.method === 'POST' || req.method === 'DELETE') {
    const usuario = usuarioDoToken(req);
    let corpo = {};

    try {
      corpo = await readJsonBody(req);
    } catch (erro) {
      res.statusCode = erro.statusCode || 400;
      res.end(JSON.stringify({ error: erro.message }));
      return;
    }

    const key = String(corpo.key || '').trim();
    if (!key) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Chave não informada.' }));
      return;
    }

    const escritaPublica = CHAVES_PROTEGIDAS.has(key) || CHAVES_PUBLICAS.has(key);

    if (!usuario && !escritaPublica) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Sem permissão para alterar esta chave.' }));
      return;
    }

    if (req.method === 'POST') {
      gravar(key, corpo.value);
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (!usuario) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Sem permissão para remover esta chave.' }));
      return;
    }

    const removido = remover(key);
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, removido }));
    return;
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Método não permitido.' }));
};