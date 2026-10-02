// Rende as paginas em um navegador real (Chrome/Edge headless) e confere se o
// front-end mostra os dados do banco sem erro de JavaScript ou imagem quebrada.
// Uso: node scripts/testes-navegador.js   (com o servidor no ar)

const assert = require('node:assert');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const PORTA_CDP = 9333;
const PERFIL = path.join(os.tmpdir(), 'canil-teste-chrome');

const NAVEGADORES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const PAGINAS = [
  { pagina: 'index.html', seletores: ['.carousel-item', '.depoimento-item', '.home-extra-grid .blog-item'] },
  { pagina: 'pets.html', seletores: ['.pet-post'] },
  { pagina: 'blog.html', seletores: ['.blog-item'] },
  { pagina: 'projeto.html', seletores: ['.projeto-testemunho, .historia-card, #projeto-testemunhos > *'] },
  { pagina: 'contato.html', seletores: ['#form-denuncia'] },
  { pagina: 'sistema.html', seletores: ['#login-sistema, #area-sistema'] },
];

function acharNavegador() {
  const achado = NAVEGADORES.find((c) => fs.existsSync(c));
  if (!achado) throw new Error('Chrome ou Edge nao encontrado neste computador.');
  return achado;
}

function abrirNavegador(navegador) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      navegador,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-features=Translate',
        `--user-data-dir=${PERFIL}`,
        `--remote-debugging-port=${PORTA_CDP}`,
        'about:blank',
      ],
      { stdio: 'ignore' },
    );

    const inicio = Date.now();
    const tentar = async () => {
      try {
        const resposta = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/version`);
        if (resposta.ok) {
          resolve(child);
          return;
        }
      } catch {
        // ainda subindo
      }
      if (Date.now() - inicio > 25000) {
        reject(new Error('navegador nao respondeu na porta de depuracao'));
        return;
      }
      setTimeout(tentar, 250);
    };
    tentar();
  });
}

function criarDespachante(ws) {
  const fila = [];
  const pendentes = new Map();

  ws.addEventListener('message', (event) => {
    const dados = JSON.parse(event.data);
    if (dados.id && pendentes.has(dados.id)) {
      pendentes.get(dados.id)(dados);
      pendentes.delete(dados.id);
      return;
    }
    fila.push(dados);
  });

  return (id, metodo, params) =>
    new Promise((resolve, reject) => {
      pendentes.set(id, (dados) => {
        if (dados.error) reject(new Error(dados.error.message));
        else resolve(dados.result);
      });
      ws.send(JSON.stringify({ id, method: metodo, params: params || {} }));
    });
}

async function main() {
  const navegador = acharNavegador();
  const child = await abrirNavegador(navegador);
  console.log(`navegador: ${navegador}\n`);

  const resposta = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/new?about:blank`, {
    method: 'PUT',
  });
  const alvo = await resposta.json();
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  const enviar = criarDespachante(ws);

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('websocket recusado')), { once: true });
  });

  await enviar(1, 'Runtime.enable');
  await enviar(2, 'Page.enable');

  let passou = 0;
  let falhou = 0;

  try {
    let id = 10;

    for (const item of PAGINAS) {
      id += 1;
      await enviar(id, 'Page.navigate', { url: `${BASE}/${item.pagina}` });
      await esperar(2000);

      id += 1;
      const avaliado = await enviar(id, 'Runtime.evaluate', {
        expression: `
          (() => {
            const imagensQuebradas = [...document.querySelectorAll('img')]
              .filter((img) => img.complete && img.naturalWidth === 0)
              .map((img) => img.getAttribute('src'));
            const contagens = {};
            for (const seletor of ${JSON.stringify(item.seletores)}) {
              contagens[seletor] = document.querySelectorAll(seletor).length;
            }
            return JSON.stringify({
              imagensQuebradas: [...new Set(imagensQuebradas)],
              contagens,
              texto: document.body.innerText.replace(/\\s+/g, ' ').trim().length,
              titulo: document.title,
            });
          })()
        `,
        returnByValue: true,
      });

      const dados = JSON.parse(avaliado.result.value);
      const problemas = [];

      if (dados.imagensQuebradas.length) {
        problemas.push(`imagens quebradas: ${dados.imagensQuebradas.slice(0, 5).join(', ')}`);
      }
      if (dados.texto < 150) problemas.push(`pouco texto renderizado (${dados.texto} caracteres)`);

      for (const [seletor, total] of Object.entries(dados.contagens)) {
        if (seletor.startsWith('#') && seletor.includes(',')) continue;
        if (total === 0 && !seletor.includes(',')) problemas.push(`nada renderizado em ${seletor}`);
      }

      if (problemas.length) {
        falhou += 1;
        console.log(`FALHA ${item.pagina}: ${problemas.join('; ')}`);
      } else {
        passou += 1;
        const resumo = Object.entries(dados.contagens)
          .map(([seletor, total]) => `${seletor}=${total}`)
          .join(' ');
        console.log(`ok   ${item.pagina}  "${dados.titulo}"  ${resumo}  (${dados.texto} chars)`);
      }
    }

    // fluxo do sistema: login real, pelo formulario
    id += 1;
    await enviar(id, 'Page.navigate', { url: `${BASE}/sistema.html` });
    await esperar(1800);

    id += 1;
    const login = await enviar(id, 'Runtime.evaluate', {
      expression: `
        (() => {
          const usuario = document.getElementById('login-usuario');
          const senha = document.getElementById('login-senha');
          if (!usuario || !senha) return JSON.stringify({ ok: false, erro: 'campos ausentes' });

          usuario.value = 'admin';
          senha.value = 'admin123';
          document.getElementById('form-login-sistema')
            .dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

          return JSON.stringify({ ok: true });
        })()
      `,
      returnByValue: true,
    });

    assert.ok(JSON.parse(login.result.value).ok, 'formulario de login nao encontrado');
    await esperar(3000);

    id += 1;
    const painel = await enviar(id, 'Runtime.evaluate', {
      expression: `
        (() => {
          const visivel = (seletor) => {
            const el = document.querySelector(seletor);
            if (!el) return false;
            return !el.hidden && getComputedStyle(el).display !== 'none';
          };
          return JSON.stringify({
            areaVisible: visivel('#area-sistema'),
            loginOculto: !visivel('#login-sistema'),
            petsNaTabela: document.querySelectorAll('#lista-animais-sistema .item-gestao').length,
            totalPets: (document.getElementById('dash-total-pets') || {}).textContent || '',
            disponiveis: (document.getElementById('dash-disponiveis') || {}).textContent || '',
            adotados: (document.getElementById('dash-adotados') || {}).textContent || '',
          });
        })()
      `,
      returnByValue: true,
    });

    const painelDados = JSON.parse(painel.result.value);
    const problemasPainel = [];
    if (!painelDados.areaVisible) problemasPainel.push('area do sistema nao apareceu');
    if (painelDados.petsNaTabela === 0) problemasPainel.push('tabela de pets vazia');

    if (problemasPainel.length) {
      falhou += 1;
      console.log(`FALHA sistema apos login: ${problemasPainel.join('; ')}`);
    } else {
      passou += 1;
      console.log(
        `ok   sistema apos login  pets=${painelDados.petsNaTabela} ` +
          `total=${painelDados.totalPets} disponiveis=${painelDados.disponiveis} adotados=${painelDados.adotados}`,
      );
    }
  } finally {
    try {
      ws.close();
    } catch {
      // ignora
    }
    child.kill();
  }

  console.log(`\n${passou} passaram, ${falhou} falharam`);
  process.exit(falhou ? 1 : 0);
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});