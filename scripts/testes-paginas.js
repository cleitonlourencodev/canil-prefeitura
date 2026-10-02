// Rende cada pagina em um DOM de mentira e confere se os dados do banco chegam.
// Uso: node scripts/testes-paginas.js
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const RAIZ = path.join(__dirname, '..');

async function pagina(nome) {
  const html = await (await fetch(`${BASE}/${nome}`)).text();
  return html;
}

async function main() {
  const storage = await (await fetch(`${BASE}/api/storage`)).json();
  const animais = JSON.parse(storage.items.pv_animais);
  const posts = JSON.parse(storage.items.pv_blog_posts);

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

  const paginas = [
    'index.html',
    'pets.html',
    'adocao.html',
    'blog.html',
    'blog-post.html',
    'projeto.html',
    'contato.html',
    'sistema.html',
  ];

  const htmls = {};
  for (const nome of paginas) htmls[nome] = await pagina(nome);

  checar('todas as paginas respondem com HTML', () => {
    for (const nome of paginas) {
      assert.ok(/<html/i.test(htmls[nome]), `${nome} sem <html>`);
    }
  });

  checar('nenhuma pagina usa imagem externa', () => {
    for (const nome of paginas) {
      assert.ok(
        !/https:\/\/(images\.unsplash|plus\.unsplash)/.test(htmls[nome]),
        `${nome} ainda usa unsplash`,
      );
    }
    const script = fs.readFileSync(path.join(RAIZ, 'script.js'), 'utf8');
    assert.ok(!/images\.unsplash\.com/.test(script), 'script.js ainda usa unsplash');
  });

  checar('script.js nao tem seeds duplicados', () => {
    const script = fs.readFileSync(path.join(RAIZ, 'script.js'), 'utf8');
    assert.ok(!/const seeds = \{/.test(script), 'bloco de seeds antigo ainda presente');
    assert.ok(!/extraSeeds|flowSeeds|testemunhoSeeds/.test(script), 'seeds antigos ainda presentes');
  });

  checar('script.js tem sintaxe valida', () => {
    const script = fs.readFileSync(path.join(RAIZ, 'script.js'), 'utf8');
    new (require('vm').Script)(script);
  });

  checar('todos os arquivos de api tem sintaxe valida', () => {
    const vm = require('vm');
    for (const arquivo of fs.readdirSync(path.join(RAIZ, 'api'))) {
      const codigo = fs.readFileSync(path.join(RAIZ, 'api', arquivo), 'utf8');
      new vm.Script(codigo, { filename: arquivo });
    }
  });

  checar('estatisticas dos dados batem com a distribuicao', () => {
    const disponiveis = animais.filter((p) => p.status === 'disponível');
    const tratamento = animais.filter((p) => p.status === 'em tratamento');
    const adotados = animais.filter((p) => p.status === 'adotado');
    assert.ok(disponiveis.length >= 10, `disponíveis: ${disponiveis.length}`);
    assert.ok(tratamento.length >= 2, `em tratamento: ${tratamento.length}`);
    assert.ok(adotados.length >= 6, `adotados: ${adotados.length}`);
  });

  checar('todo pet tem galeria e imagem de perfil valida', () => {
    const RAIZ_UPLOADS = path.join(RAIZ, 'uploads', 'pets');
    for (const pet of animais) {
      assert.ok(pet.nome, 'pet sem nome');
      assert.ok(Array.isArray(pet.galeria) && pet.galeria.length > 0, `${pet.nome} sem galeria`);
      const indice = Number(pet.fotoPerfilIndex || 0);
      assert.ok(indice >= 0 && indice < pet.galeria.length, `${pet.nome} com perfil inválido`);
      assert.ok(fs.existsSync(path.join(RAIZ, pet.galeria[indice])), `${pet.nome} sem arquivo de perfil`);
    }
  });

  checar('especie bate com as fotos do pet', () => {
    const indice = JSON.parse(
      fs.readFileSync(path.join(RAIZ, 'uploads', 'indice-fotos.json'), 'utf8'),
    );
    const porArquivo = new Map(
      indice.map((i) => [i.arquivo, i.especie === 'cao' ? 'cão' : i.especie]),
    );
    let conferidas = 0;

    for (const pet of animais) {
      for (const foto of pet.galeria) {
        const arquivo = foto.replace('uploads/pets/', '');
        const especieFoto = porArquivo.get(arquivo);
        if (!especieFoto) continue;
        conferidas += 1;
        assert.strictEqual(
          especieFoto,
          pet.especie,
          `${pet.nome} (${pet.especie}) com foto de ${especieFoto}: ${arquivo}`,
        );
      }
    }

    assert.ok(conferidas > 20, `conferidas: ${conferidas}`);
    console.log(`     (${conferidas} fotos de pets conferidas contra o catalogo)`);
  });

  checar('toda Historia publicada tem texto', () => {
    for (const pet of animais) {
      if (!pet.historiaPublicado) continue;
      assert.ok(String(pet.historiaAdocao || '').trim(), `${pet.nome} publicado sem texto`);
      assert.ok(String(pet.adotante || '').trim(), `${pet.nome} publicado sem adotante`);
      assert.ok(pet.historiaPublicadoEm, `${pet.nome} publicado sem data`);
    }
  });

  checar('todo post tem capa existente e conteudo', () => {
    for (const post of posts) {
      assert.ok(post.titulo, 'post sem titulo');
      assert.ok(String(post.conteudo || '').length > 80, `${post.id} com conteudo curto`);
      assert.ok(fs.existsSync(path.join(RAIZ, post.capa)), `${post.id} sem capa`);
    }
  });

  checar('links internos das paginas existem', () => {
    for (const nome of paginas) {
      for (const achado of htmls[nome].matchAll(/href="([^"#?]+\.html)"/g)) {
        const destino = achado[1];
        assert.ok(fs.existsSync(path.join(RAIZ, destino)), `${nome} link quebrado: ${destino}`);
      }
    }
  });

  checar('scripts e estilos referenciados existem', () => {
    for (const nome of paginas) {
      for (const achado of htmls[nome].matchAll(/(?:src|href)="((?!http|data:|#)[^"]+\.(?:js|css))"/g)) {
        assert.ok(fs.existsSync(path.join(RAIZ, achado[1])), `${nome} sem ${achado[1]}`);
      }
    }
  });

  console.log(`\n${passou} passaram, ${falhou} falharam`);
  process.exit(falhou ? 1 : 0);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});