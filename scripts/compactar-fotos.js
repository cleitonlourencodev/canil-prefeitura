// Reduz o acervo de fotos: mantem um conjunto curado por especie e
// rebaixa em resolucao menor (800px) para deixar o repositorio leve.
// Uso: node scripts/compactar-fotos.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DESTINO = path.join(ROOT, 'uploads', 'pets');
const INDICE = path.join(ROOT, 'uploads', 'indice-fotos.json');
const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'CanilPrefeitura/1.0 (projeto demonstrativo; uso educacional)';

const LIMITE = { cao: 34, gato: 24 };

const PREFERIR = [
  'portrait', 'head', 'face', 'close', 'smiling', 'sitting', 'lying', 'standing',
  'street', 'shelter', 'rescue', 'friendly',
];

function pontuar(item) {
  const titulo = item.titulo.toLowerCase();
  let pontos = 0;
  for (const termo of PREFERIR) if (titulo.includes(termo)) pontos += 2;
  if (titulo.length < 45) pontos += 1;
  if (/\d{4,}/.test(titulo)) pontos -= 1;
  if (/(show|award|champion|competition|pedigree|certificate)/i.test(titulo)) pontos -= 3;
  if (/(dead|grave|memorial|museum|taxidermy|skull)/i.test(titulo)) pontos -= 5;
  return pontos;
}

async function consultar(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  for (let tentativa = 0; tentativa < 6; tentativa += 1) {
    const resposta = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (resposta.status === 429) {
      await new Promise((r) => setTimeout(r, 5000 * (tentativa + 1)));
      continue;
    }
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json();
  }
  throw new Error('rate limit');
}

async function infoPorTitulo(titulos) {
  const resultado = new Map();
  for (let i = 0; i < titulos.length; i += 20) {
    const lote = titulos.slice(i, i + 20);
    const json = await consultar({
      action: 'query',
      titles: lote.map((t) => `File:${t}`).join('|'),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '800',
    });
    const paginas = json?.query?.pages ? Object.values(json.query.pages) : [];
    for (const pagina of paginas) {
      const info = pagina.imageinfo?.[0];
      if (!info?.thumburl) continue;
      resultado.set(pagina.title.replace(/^File:/i, ''), info);
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  return resultado;
}

async function main() {
  const indice = JSON.parse(fs.readFileSync(INDICE, 'utf8'));

  const escolhidos = [];
  for (const especie of ['cao', 'gato']) {
    const candidatos = indice
      .filter((item) => item.especie === especie)
      .sort((a, b) => pontuar(b) - pontuar(a) || a.titulo.localeCompare(b.titulo))
      .slice(0, LIMITE[especie]);
    escolhidos.push(...candidatos);
  }

  const manter = new Set(escolhidos.map((item) => item.arquivo));
  const titulos = escolhidos.map((item) => item.titulo);

  process.stdout.write('consultando URLs...\n');
  const infos = await infoPorTitulo(titulos);

  const saida = [];
  for (const item of escolhidos) {
    const info = infos.get(item.titulo);
    if (!info) {
      console.log(`sem info: ${item.titulo}`);
      continue;
    }

    const destino = path.join(DESTINO, item.arquivo);
    try {
      const resposta = await fetch(info.thumburl, { headers: { 'User-Agent': USER_AGENT } });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const buffer = Buffer.from(await resposta.arrayBuffer());
      if (buffer.length < 6000) throw new Error('pequena demais');
      fs.writeFileSync(destino, buffer);
      saida.push({ ...item, bytes: buffer.length });
    } catch (error) {
      console.log(`falha ${item.arquivo}: ${error.message}`);
      continue;
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  const manterFinal = new Set(saida.map((item) => item.arquivo));
  for (const arquivo of fs.readdirSync(DESTINO)) {
    if (!manterFinal.has(arquivo)) {
      fs.unlinkSync(path.join(DESTINO, arquivo));
    }
  }

  fs.writeFileSync(INDICE, `${JSON.stringify(saida, null, 2)}\n`);

  const total = saida.reduce((acc, item) => acc + item.bytes, 0);
  const porEspecie = saida.reduce((acc, item) => {
    acc[item.especie] = (acc[item.especie] || 0) + 1;
    return acc;
  }, {});
  console.log(`mantidas ${saida.length} fotos, ${(total / 1024 / 1024).toFixed(1)} MB`, porEspecie);
}

main();