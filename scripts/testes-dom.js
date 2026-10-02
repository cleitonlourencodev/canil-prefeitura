// Confere se a marcacao do HTML cobre o que o script.js manipula.
// Uso: node scripts/testes-dom.js   (com o servidor no ar)
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const RAIZ = path.resolve(__dirname, '..');

const PAGINAS = [
  'index.html',
  'pets.html',
  'adocao.html',
  'blog.html',
  'blog-post.html',
  'projeto.html',
  'contato.html',
  'sistema.html',
];

// IDs criados dinamicamente pelo script (nao precisam existir no HTML).
const CRIADOS_PELO_SCRIPT = new Set(['carousel-image']);

function htmlLocal(nome) {
  return fs.readFileSync(path.join(RAIZ, nome), 'utf8');
}

function idsDoHtml() {
  const ids = new Set();
  for (const nome of PAGINAS) {
    for (const achado of htmlLocal(nome).matchAll(/\sid="([^"]+)"/g)) {
      ids.add(achado[1]);
    }
  }
  return ids;
}

async function main() {
  const htmlsServidor = {};
  for (const nome of PAGINAS) {
    htmlsServidor[nome] = await (await fetch(`${BASE}/${nome}`)).text();
  }

  const script = fs.readFileSync(path.join(RAIZ, 'script.js'), 'utf8');
  const htmlIds = idsDoHtml();

  let passou = 0;
  let falhou = 0;

  const checar = (nome, fn) => {
    try {
      fn();
      passou += 1;
      console.log(`ok   ${nome}`);
    } catch (erro) {
      falhou += 1;
      console.log(`FALHA ${nome}: ${erro.message}`);
    }
  };

  checar('servidor entrega o mesmo HTML do disco', () => {
    for (const nome of PAGINAS) {
      assert.strictEqual(
        htmlsServidor[nome].replace(/\r\n/g, '\n'),
        htmlLocal(nome).replace(/\r\n/g, '\n'),
        `${nome} difere`,
      );
    }
  });

  checar('todo getElementById do script existe em alguma pagina', () => {
    const ids = new Set();
    for (const achado of script.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)) ids.add(achado[1]);

    const orfaos = [...ids]
      .filter((id) => !htmlIds.has(id) && !CRIADOS_PELO_SCRIPT.has(id))
      .sort();

    console.log(`     (${ids.size} IDs referenciados, ${orfaos.length} sem correspondencia)`);
    assert.deepStrictEqual(orfaos, [], `IDs sem elemento: ${orfaos.join(', ')}`);
  });

  checar('todo inputValue/setText do script tem elemento', () => {
    const ids = new Set();
    for (const achado of script.matchAll(/(?:inputValue|setText|setInputValue)\(['"]([^'"]+)['"]\)/g)) {
      ids.add(achado[1]);
    }

    const orfaos = [...ids].filter((id) => !htmlIds.has(id)).sort();
    console.log(`     (${ids.size} IDs usados por helpers, ${orfaos.length} sem elemento)`);
    assert.deepStrictEqual(orfaos, [], `IDs sem elemento: ${orfaos.join(', ')}`);
  });

  checar('ids duplicados dentro de uma mesma pagina', () => {
    for (const nome of PAGINAS) {
      const html = htmlLocal(nome);
      const vistos = new Set();
      const repetidos = [];
      for (const achado of html.matchAll(/\sid="([^"]+)"/g)) {
        if (vistos.has(achado[1])) repetidos.push(achado[1]);
        vistos.add(achado[1]);
      }
      assert.deepStrictEqual(repetidos, [], `${nome} repete: ${repetidos.join(', ')}`);
    }
  });

  checar('todo data-* do HTML e manuseado pelo script', () => {
    const todoHtml = PAGINAS.map(htmlLocal).join('\n');

    const noHtml = new Set();
    for (const achado of todoHtml.matchAll(/\s(data-[a-z0-9-]+)=/g)) noHtml.add(achado[1]);

    const orfaos = [...noHtml].filter((attr) => !script.includes(attr)).sort();
    console.log(`     (${noHtml.size} data-* no HTML, ${orfaos.length} sem uso no script)`);
    assert.deepStrictEqual(orfaos, [], `data-* sem uso: ${orfaos.join(', ')}`);
  });

  checar('nenhuma pagina usa imagem externa', () => {
    for (const nome of PAGINAS) {
      assert.ok(!/https:\/\/(images|plus)\.unsplash/.test(htmlLocal(nome)), `${nome} usa unsplash`);
    }
    assert.ok(!/images\.unsplash\.com/.test(script), 'script.js usa unsplash');
  });

  checar('script.js tem sintaxe valida', () => {
    new (require('vm').Script)(script);
  });

  checar('arquivos de api tem sintaxe valida', () => {
    const vm = require('vm');
    for (const arquivo of fs.readdirSync(path.join(RAIZ, 'api'))) {
      new vm.Script(fs.readFileSync(path.join(RAIZ, 'api', arquivo), 'utf8'), { filename: arquivo });
    }
  });

  checar('scripts de scripts/ tem sintaxe valida', () => {
    const vm = require('vm');
    for (const arquivo of fs.readdirSync(path.join(RAIZ, 'scripts')).filter((f) => f.endsWith('.js'))) {
      new vm.Script(fs.readFileSync(path.join(RAIZ, 'scripts', arquivo), 'utf8'), { filename: arquivo });
    }
  });

  checar('script.js nao grava mais em localStorage', () => {
    assert.ok(!/localStorage\.setItem\(STORAGE_KEYS/.test(script), 'ainda grava em localStorage');
  });

  checar('nenhuma chave de storage fora do contrato da API', () => {
    const chaves = new Set();
    for (const achado of script.matchAll(/STORAGE_KEYS\.(\w+)/g)) chaves.add(achado[1]);

    const chavesDb = ['animais', 'blog', 'denuncias', 'interesses', 'usuarios', 'auditoria'];
    const orfaos = [...chaves].filter((chave) => !chavesDb.includes(chave)).sort();
    console.log(`     (${chaves.size} chaves usadas, ${orfaos.length} fora do contrato)`);
    assert.deepStrictEqual(orfaos, [], `chaves fora do contrato: ${orfaos.join(', ')}`);
  });

  console.log(`\n${passou} passaram, ${falhou} falharam`);
  process.exit(falhou ? 1 : 0);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});