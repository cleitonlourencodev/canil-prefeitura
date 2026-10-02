// scripts/seed.js
// (Re)cria db/canil.sqlite com os dados de demonstracao de api/_seed.js.
// Uso: npm run seed   |   npm run seed:reset (apaga antes)

const fs = require('node:fs');
const path = require('node:path');

const DB_DIR = path.resolve(__dirname, '..', 'db');
const DB_PATH = process.env.CANIL_DB_PATH || path.join(DB_DIR, 'canil.sqlite');

const { CHAVES, gravarLote, getDb } = require('../api/_db');
const { PETS, POSTS, INTERESSES, DENUNCIAS, USUARIOS, AUDITORIA } = require('../api/_seed');

const reset = process.argv.includes('--reset');
const db = getDb();

if (reset) {
  // Limpa as tabelas em vez de apagar o arquivo: funciona mesmo com o servidor no ar.
  db.exec('DELETE FROM app_storage;');
  db.exec('DELETE FROM uploads;');
  console.log('conteudo anterior removido');
}

gravarLote([
  { chave: CHAVES.animais, valor: JSON.stringify(PETS) },
  { chave: CHAVES.blog, valor: JSON.stringify(POSTS) },
  { chave: CHAVES.interesses, valor: JSON.stringify(INTERESSES) },
  { chave: CHAVES.denuncias, valor: JSON.stringify(DENUNCIAS) },
  { chave: CHAVES.usuarios, valor: JSON.stringify(USUARIOS) },
  { chave: CHAVES.auditoria, valor: JSON.stringify(AUDITORIA) },
  {
    chave: CHAVES.metaSeed,
    valor: JSON.stringify({ versao: 1, atualizadoEm: new Date().toISOString() }),
  },
]);

// O arquivo do banco e versionado no Git, entao consolidamos o WAL dentro dele
// para que quem clonar o repositorioreceba o conteudo completo.
db.exec('PRAGMA wal_checkpoint(TRUNCATE);');

console.log(`banco criado em ${path.relative(process.cwd(), DB_PATH)}`);
console.log(
  `pets: ${PETS.length} | posts: ${POSTS.length} | interesses: ${INTERESSES.length} | ` +
    `denúncias: ${DENUNCIAS.length} | usuários: ${USUARIOS.length}`,
);