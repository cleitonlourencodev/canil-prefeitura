// Confere, no navegador, que logo, favicon e capa nao perderam transparencia.
// Uma imagem com fundo preto aparece com naturalWidth ok, entao checamos os
// pixels da imagem em si via canvas.
// Uso: node scripts/testes-imagens.js

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const PORTA_CDP = 9334;
const PERFIL = path.join(require('node:os').tmpdir(), 'canil-teste-imagens');

const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

const ALVOS = [
  { arquivo: 'image/pingente.png', rotulo: 'logo e favicon' },
  { arquivo: 'image/criancas.png', rotulo: 'capa do inicio' },
];

function abrir() {
  const navegador = NAVEGADORES.find((c) => fs.existsSync(c));
  if (!navegador) throw new Error('Chrome ou Edge nao encontrado.');

  const child = spawn(
    navegador,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${PERFIL}`,
      `--remote-debugging-port=${PORTA_CDP}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  return new Promise((resolve, reject) => {
    const inicio = Date.now();
    const tentar = async () => {
      try {
        if ((await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`)).ok) return resolve(child);
      } catch { /* subindo */ }
      if (Date.now() - inicio > 25000) return reject(new Error('navegador nao respondeu'));
      setTimeout(tentar, 250);
    };
    tentar();
  });
}

function despachante(ws) {
  const pendentes = new Map();
  ws.addEventListener('message', (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pendentes.has(d.id)) {
      pendentes.get(d.id)(d);
      pendentes.delete(d.id);
    }
  });
  return (id, method, params) =>
    new Promise((resolve, reject) => {
      pendentes.set(id, (d) => (d.error ? reject(new Error(d.error.message)) : resolve(d.result)));
      ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
}

async function main() {
  const child = await abrir();
  const alvo = await (
    await fetch(`http://127.0.0.1:${PORTA_CDP}/json/new?about:blank`, { method: 'PUT' })
  ).json();
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  const enviar = despachante(ws);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  await enviar(1, 'Runtime.enable');
  await enviar(2, 'Page.enable');

  let passou = 0;
  let falhou = 0;

  try {
    let id = 10;

    // Carrega o site antes de medir: sem a mesma origem, o canvas fica
    // "tainted" e getImageData e bloqueado pelo navegador.
    await enviar(id++, 'Page.navigate', { url: `${BASE}/index.html` });
    await new Promise((r) => setTimeout(r, 2000));

    for (const item of ALVOS) {
      id += 1;
      const r = await enviar(id, 'Runtime.evaluate', {
        expression: `
          (async () => {
            const img = new Image();
            img.src = ${JSON.stringify(`${BASE}/${item.arquivo}`)};
            await img.decode();

            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const dados = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let transparentes = 0;
            let pretosOpacos = 0;
            for (let i = 0; i < dados.length; i += 4) {
              const [r, g, b, a] = [dados[i], dados[i + 1], dados[i + 2], dados[i + 3]];
              if (a < 20) transparentes += 1;
              else if (r < 12 && g < 12 && b < 12) pretosOpacos += 1;
            }

            const total = dados.length / 4;
            return JSON.stringify({
              largura: img.naturalWidth,
              altura: img.naturalHeight,
              transparentes: transparentes / total,
              pretosOpacos: pretosOpacos / total,
            });
          })()
        `,
        awaitPromise: true,
        returnByValue: true,
      });

      if (!r || r.exceptionDetails) {
        falhou += 1;
        console.log(
          `FALHA ${item.arquivo}: ${JSON.stringify(r?.exceptionDetails?.exception?.description || r)}`,
        );
        continue;
      }

      const d = JSON.parse(r.result.value);
      const problemas = [];

      if (d.transparentes < 0.05) {
        problemas.push(`quase sem transparencia (${(d.transparentes * 100).toFixed(1)}%)`);
      }
      if (d.pretosOpacos > 0.25) {
        problemas.push(`muito preto opaco (${(d.pretosOpacos * 100).toFixed(1)}%)`);
      }

      if (problemas.length) {
        falhou += 1;
        console.log(`FALHA ${item.arquivo} (${item.rotulo}): ${problemas.join('; ')}`);
      } else {
        passou += 1;
        console.log(
          `ok   ${item.arquivo} (${item.rotulo})  ${d.largura}x${d.altura}  ` +
            `transparente ${(d.transparentes * 100).toFixed(1)}%  preto opaco ${(d.pretosOpacos * 100).toFixed(1)}%`,
        );
      }
    }

    // Confirmacao final: os arquivos sao servidos pelo projeto e o navegador
    // consegue decodifica-los (favicon e capa pointed by the HTML).
    id += 1;
    const carregadas = await enviar(id, 'Runtime.evaluate', {
      expression: `
        (async () => {
          const urls = [
            ${JSON.stringify(`${BASE}/image/pingente.png`)},
            ${JSON.stringify(`${BASE}/image/criancas.png`)},
          ];
          const resultado = [];
          for (const url of urls) {
            const img = new Image();
            img.src = url;
            try {
              await img.decode();
              resultado.push({ url, ok: true, dim: img.naturalWidth + 'x' + img.naturalHeight });
            } catch (erro) {
              resultado.push({ url, ok: false, erro: String(erro) });
            }
          }
          return JSON.stringify(resultado);
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    for (const item of JSON.parse(carregadas.result.value)) {
      const nome = item.url.split('/').pop();
      if (item.ok) {
        passou += 1;
        console.log(`ok   servida e decodificada: ${nome}  ${item.dim}`);
      } else {
        falhou += 1;
        console.log(`FALHA ${nome}: ${item.erro}`);
      }
    }
  } finally {
    try {
      ws.close();
    } catch { /* ignora */ }
    child.kill();
  }

  console.log(`\n${passou} passaram, ${falhou} falharam`);
  process.exit(falhou ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});