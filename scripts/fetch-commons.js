// Baixa fotos de caes e gatos do Wikimedia Commons por categoria curada.
// Categorias guarantee a especie, e guardamos autor/licenca em indice-fotos.json.
// Uso: node scripts/fetch-commons.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DESTINO = path.join(ROOT, 'uploads', 'pets');
const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'CanilPrefeitura/1.0 (projeto demonstrativo; uso educacional)';

const CATEGORIAS = [
  { categoria: 'Category:Golden Retriever', especie: 'cao' },
  { categoria: 'Category:Labrador Retriever', especie: 'cao' },
  { categoria: 'Category:Beagle', especie: 'cao' },
  { categoria: 'Category:German Shepherd Dog', especie: 'cao' },
  { categoria: 'Category:Poodles', especie: 'cao' },
  { categoria: 'Category:Dachshunds', especie: 'cao' },
  { categoria: 'Category:Boxers (dog)', especie: 'cao' },
  { categoria: 'Category:Border Collies', especie: 'cao' },
  { categoria: 'Category:Puppies', especie: 'cao' },
  { categoria: 'Category:Street dogs', especie: 'cao' },
  { categoria: 'Category:Tabby cats', especie: 'gato' },
  { categoria: 'Category:Siamese cats', especie: 'gato' },
  { categoria: 'Category:Persian cats', especie: 'gato' },
  { categoria: 'Category:Calico cats', especie: 'gato' },
  { categoria: 'Category:Black-and-white cats', especie: 'gato' },
  { categoria: 'Category:Kittens', especie: 'gato' },
  { categoria: 'Category:Street cats', especie: 'gato' },
];

const IGNORAR =
  /(logo|map|coat of arms|diagram|chart|sculpture|statue|monument|drawing|painting|sketch|engraving|stamp|coin|banner|flag|sign|plaque|poster|graffiti|vase|pottery|relief|carving|manuscript|book|cover)/i;

const 잠금 = new Set();

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function consultar(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  for (let tentativa = 0; tentativa < 5; tentativa += 1) {
    const resposta = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (resposta.status === 429) {
      await esperar(4000 * (tentativa + 1));
      continue;
    }
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json();
  }
  throw new Error('rate limit');
}

async function listarCategoria(categoria, limite = 60) {
  const json = await consultar({
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: categoria,
    gcmtype: 'file',
    gcmlimit: String(limite),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1200',
  });
  return json?.query?.pages ? Object.values(json.query.pages) : [];
}

function textoLimpo(valor) {
  return String(valor || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugizar(texto) {
  return String(texto)
    .replace(/^File:/i, '')
    .replace(/\.(jpe?g|png)$/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 64);
}

function arquivoPermitido(pagina) {
  const titulo = String(pagina.title || '');
  if (!/\.(jpe?g|png)$/i.test(titulo)) return false;
  if (IGNORAR.test(titulo)) return false;
  const info = pagina.imageinfo?.[0];
  if (!info?.thumburl) return false;
  if (info.width < 900 || info.height < 700) return false;
  const proporcao = info.width / info.height;
  if (proporcao < 0.75 || proporcao > 2.2) return false;
  return true;
}

async function main() {
  fs.mkdirSync(DESTINO, { recursive: true });

  const candidatos = new Map();

  for (const entrada of CATEGORIAS) {
    process.stdout.write(`buscando ${entrada.categoria}... `);
    try {
      const paginas = await listarCategoria(entrada.categoria);
      let aceitos = 0;
      for (const pagina of paginas) {
        if (!arquivoPermitido(pagina)) continue;
        const chave = pagina.title;
        if (candidatos.has(chave)) continue;
        candidatos.set(chave, { pagina, especie: entrada.especie });
        aceitos += 1;
      }
      console.log(`${aceitos} candidatos`);
    } catch (error) {
      console.log(`falhou (${error.message})`);
    }
    await esperar(900);
  }

  console.log(`\n${candidatos.size} candidatos no total`);

  const indice = [];
  const vistos = new Set();

  for (const { pagina, especie } of candidatos.values()) {
    const info = pagina.imageinfo[0];
    const nome = slugizar(pagina.title);
    if (!nome || vistos.has(nome)) continue;
    vistos.add(nome);

    const destino = path.join(DESTINO, `${nome}.jpg`);
    if (!fs.existsSync(destino)) {
      try {
        const resposta = await fetch(info.thumburl, { headers: { 'User-Agent': USER_AGENT } });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const buffer = Buffer.from(await resposta.arrayBuffer());
        if (buffer.length < 10000) throw new Error('pequena demais');
        fs.writeFileSync(destino, buffer);
      } catch (error) {
        console.log(`falha ${nome}: ${error.message}`);
        continue;
      }
      await esperar(250);
    }

    indice.push({
      arquivo: `${nome}.jpg`,
      especie,
      titulo: pagina.title.replace(/^File:/i, ''),
      autor: textoLimpo(info.extmetadata?.Artist?.value).slice(0, 120),
      licenca: textoLimpo(info.extmetadata?.LicenseShortName?.value).slice(0, 60),
      descricao: textoLimpo(info.extmetadata?.ImageDescription?.value).slice(0, 200),
      pagina: `https://commons.wikimedia.org/wiki/${encodeURIComponent(pagina.title)}`,
    });
  }

  fs.writeFileSync(
    path.join(ROOT, 'uploads', 'indice-fotos.json'),
    `${JSON.stringify(indice, null, 2)}\n`,
  );

  const porEspecie = indice.reduce((acc, item) => {
    acc[item.especie] = (acc[item.especie] || 0) + 1;
    return acc;
  }, {});
  console.log(`salvas: ${indice.length}`, porEspecie);
}

main();