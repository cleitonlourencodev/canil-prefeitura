// Confere se os dados caem dentro das janelas usadas pelo painel do sistema.
// Uso: node scripts/db-check.js

const { CHAVES, ler, getDb, DB_PATH } = require('../api/_db');

const CHAVES_INTERESSANTES = [
  CHAVES.animais,
  CHAVES.blog,
  CHAVES.interesses,
  CHAVES.denuncias,
  CHAVES.usuarios,
  CHAVES.auditoria,
];

const DIA = 24 * 60 * 60 * 1000;

getDb();

console.log(`banco: ${DB_PATH}\n`);

for (const chave of CHAVES_INTERESSANTES) {
  const bruto = ler(chave);
  let total = 0;
  try {
    total = JSON.parse(bruto || '[]').length;
  } catch {
    total = 'JSON invalido';
  }
  const tamanho = bruto ? `${Math.round(Buffer.byteLength(bruto) / 1024)} KB` : 'vazio';
  console.log(`${chave.padEnd(28)} ${String(total).padStart(6)} itens  (${tamanho})`);
}

function dentroDoPeriodo(valor, dias) {
  const ts = Date.parse(valor);
  if (!Number.isFinite(ts)) return false;
  return ts >= Date.now() - dias * DIA;
}

const animais = JSON.parse(ler(CHAVES.animais) || '[]');
const posts = JSON.parse(ler(CHAVES.blog) || '[]');
const interesses = JSON.parse(ler(CHAVES.interesses) || '[]');
const denuncias = JSON.parse(ler(CHAVES.denuncias) || '[]');

console.log('\ncobertura temporal (padrao do painel = 90 dias):');
for (const dias of [30, 90, 180, 365]) {
  console.log(
    `  ${String(dias).padStart(3)} dias: ` +
      `pets ${animais.filter((p) => dentroDoPeriodo(p.criadoEm || p.atualizadoEm, dias)).length}` +
      ` | posts ${posts.filter((p) => dentroDoPeriodo(p.data, dias)).length}` +
      ` | interesses ${interesses.filter((i) => dentroDoPeriodo(i.criadoEm, dias)).length}` +
      ` | denuncias ${denuncias.filter((d) => dentroDoPeriodo(d.criadoEm, dias)).length}`,
  );
}

const maisNovo = animais
  .map((p) => p.atualizadoEm)
  .filter(Boolean)
  .sort()
  .pop();
console.log(`\nregistro mais recente: ${maisNovo}`);

const uploads = getDb().prepare('SELECT COUNT(*) AS total FROM uploads').get();
console.log(`uploads registrados: ${uploads.total}`);