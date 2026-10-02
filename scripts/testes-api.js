// scripts/testes-api.js
// Testa a API do projeto sem depender do navegador.
// Uso: node scripts/testes-api.js
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BASE = process.env.BASE_URL || 'http://localhost:4173';

async function chamar(rota, opcoes = {}) {
  const resposta = await fetch(`${BASE}${rota}`, opcoes);
  const texto = await resposta.text();
  let corpo;
  try {
    corpo = JSON.parse(texto);
  } catch {
    corpo = texto;
  }
  return { status: resposta.status, corpo };
}

async function main() {
  let passou = 0;
  let falhou = 0;

  const checar = async (nome, fn) => {
    try {
      await fn();
      passou += 1;
      console.log(`ok   ${nome}`);
    } catch (erro) {
      falhou += 1;
      console.log(`FALHA ${nome}: ${erro.message}`);
    }
  };

  await checar('site responde na raiz', async () => {
    const r = await fetch(`${BASE}/`);
    assert.strictEqual(r.status, 200);
  });

  await checar('script.js responde', async () => {
    const r = await fetch(`${BASE}/script.js`);
    assert.strictEqual(r.status, 200);
  });

  await checar('imagem local responde', async () => {
    const r = await fetch(`${BASE}/uploads/pets/a-golden-retriever-barras.jpg`);
    assert.strictEqual(r.status, 200);
  });

  await checar('banco sqlite nao e servido', async () => {
    const r = await fetch(`${BASE}/db/canil.sqlite`);
    assert.strictEqual(r.status, 403);
  });

  await checar('bootstrap carrega os dados', async () => {
    const { status, corpo } = await chamar('/api/bootstrap', { method: 'POST' });
    assert.strictEqual(status, 200);
    assert.ok(corpo.totais.animais > 20, `esperava 20+ pets, veio ${corpo.totais.animais}`);
  });

  await checar('storage GET devolve os pets', async () => {
    const { status, corpo } = await chamar('/api/storage');
    assert.strictEqual(status, 200);
    const animais = JSON.parse(corpo.items.pv_animais);
    assert.ok(animais.length > 20, `pets: ${animais.length}`);
  });

  await checar('senhas nunca saem na leitura publica', async () => {
    const { corpo } = await chamar('/api/storage');
    assert.ok(!corpo.items.pv_usuarios.includes('senhaHash'), 'senhaHash vazou');
  });

  await checar('login valido devolve token', async () => {
    const { status, corpo } = await chamar('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: 'admin', senha: 'admin123' }),
    });
    assert.strictEqual(status, 200);
    assert.ok(corpo.token, 'sem token');
  });

  await checar('login invalido e recusado', async () => {
    const { status } = await chamar('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: 'admin', senha: 'errada' }),
    });
    assert.strictEqual(status, 401);
  });

  await checar('escrita sem token e bloqueada', async () => {
    const { status } = await chamar('/api/storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pv_animais', value: '[]' }),
    });
    assert.strictEqual(status, 401);
  });

  await checar('escrita publica (interesse) funciona sem token', async () => {
    const registro = JSON.stringify([
      {
        id: 'int-teste',
        petId: 'pet-nina',
        petNome: 'Nina',
        nome: 'Teste',
        whatsapp: '(69) 9 9000-0000',
        email: 'teste@email.com',
        cidade: 'Vilhena',
        mensagem: 'Teste automatico',
        criadoEm: new Date().toISOString(),
        origem: 'site',
        statusAtendimento: 'novo',
        prioridadeAtendimento: 'media',
      },
    ]);

    const { status } = await chamar('/api/storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pv_interesses_adocao', value: registro }),
    });
    assert.strictEqual(status, 200);
  });

  await checar('upload exige token', async () => {
    const { status } = await chamar('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=xx' },
      body: '--xx--',
    });
    assert.strictEqual(status, 401);
  });

  await checar('upload com token grava em uploads/', async () => {
    const login = await chamar('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: 'admin', senha: 'admin123' }),
    });

    const boundary = '----canilteste';
    const imagem = fs.readFileSync(
      path.join(__dirname, '..', 'uploads', 'pets', 'a-golden-retriever-barras.jpg'),
    );

    const partes = [
      `--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\ntestes\r\n`,
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="teste.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`,
      imagem,
      `\r\n--${boundary}--\r\n`,
    ];

    const corpo = Buffer.concat(partes.map((p) => (Buffer.isBuffer(p) ? p : Buffer.from(p))));

    const { status, corpo: retorno } = await chamar('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${login.corpo.token}`,
      },
      body: corpo,
    });

    assert.strictEqual(status, 200, JSON.stringify(retorno));
    assert.ok(retorno.publicUrl.startsWith('/uploads/testes/'), retorno.publicUrl);

    const arquivo = path.join(__dirname, '..', retorno.publicUrl);
    assert.ok(fs.existsSync(arquivo), 'arquivo não criado');
    fs.unlinkSync(arquivo);
  });

  await checar('imagens de galeria existem no disco', async () => {
    const { corpo } = await chamar('/api/storage');
    const animais = JSON.parse(corpo.items.pv_animais);
    const posts = JSON.parse(corpo.items.pv_blog_posts);
    const raiz = path.join(__dirname, '..');

    for (const pet of animais) {
      for (const foto of pet.galeria || []) {
        assert.ok(fs.existsSync(path.join(raiz, foto)), `foto ausente: ${foto}`);
      }
    }
    for (const post of posts) {
      assert.ok(fs.existsSync(path.join(raiz, post.capa)), `capa ausente: ${post.capa}`);
    }
  });

  await checar('historias de adocao publicadas', async () => {
    const { corpo } = await chamar('/api/storage');
    const animais = JSON.parse(corpo.items.pv_animais);
    const publicadas = animais.filter((p) => p.historiaPublicado && p.historiaAdocao);
    assert.ok(publicadas.length >= 4, `histórias: ${publicadas.length}`);
  });

  console.log(`\n${passou} passaram, ${falhou} falharam`);
  process.exit(falhou ? 1 : 0);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});