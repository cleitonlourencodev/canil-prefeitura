// api/bootstrap.js
// Carrega os dados de demonstracao em db/canil.sqlite.
// Idempotente: so insere o que ainda nao existe, preservando edicoes do painel.

const { CHAVES, ler, gravarLote } = require('./_db');
const { PETS, POSTS, INTERESSES, DENUNCIAS, USUARIOS, AUDITORIA } = require('./_seed');

function mesclarPorId(atual, incoming) {
  const mapa = new Map((Array.isArray(atual) ? atual : []).map((item) => [item.id, item]));
  for (const item of incoming) {
    if (!mapa.has(item.id)) mapa.set(item.id, item);
  }
  return [...mapa.values()];
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método não permitido.' }));
    return;
  }

  let animais = [];
  let posts = [];
  let interesses = [];
  let denuncias = [];
  let usuarios = [];
  let auditoria = [];

  try {
    animais = JSON.parse(ler(CHAVES.animais) || '[]');
    posts = JSON.parse(ler(CHAVES.blog) || '[]');
    interesses = JSON.parse(ler(CHAVES.interesses) || '[]');
    denuncias = JSON.parse(ler(CHAVES.denuncias) || '[]');
    usuarios = JSON.parse(ler(CHAVES.usuarios) || '[]');
    auditoria = JSON.parse(ler(CHAVES.auditoria) || '[]');
  } catch {
    // banco corrompido: recomeca do zero
  }

  animais = mesclarPorId(animais, PETS);
  posts = mesclarPorId(posts, POSTS);
  interesses = mesclarPorId(interesses, INTERESSES);
  denuncias = mesclarPorId(denuncias, DENUNCIAS);
  usuarios = mesclarPorId(usuarios, USUARIOS);
  auditoria = mesclarPorId(auditoria, AUDITORIA);

  // No Vercel o sistema de arquivos e somente-leitura: gravarLote falha,
  // mas os dados ja estao no db/commitado, entao devolvemos os totais mesmo assim.
  try {
    gravarLote([
      { chave: CHAVES.animais, valor: JSON.stringify(animais) },
      { chave: CHAVES.blog, valor: JSON.stringify(posts) },
      { chave: CHAVES.interesses, valor: JSON.stringify(interesses) },
      { chave: CHAVES.denuncias, valor: JSON.stringify(denuncias) },
      { chave: CHAVES.usuarios, valor: JSON.stringify(usuarios) },
      { chave: CHAVES.auditoria, valor: JSON.stringify(auditoria) },
      {
        chave: CHAVES.metaSeed,
        valor: JSON.stringify({ versao: 1, atualizadoEm: new Date().toISOString() }),
      },
    ]);
  } catch (erro) {
    // Sistema de arquivos somente-leitura: os dados ja estao presentes.
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      totais: {
        animais: animais.length,
        posts: posts.length,
        interesses: interesses.length,
        denuncias: denuncias.length,
        usuarios: usuarios.length,
      },
    }),
  );
};