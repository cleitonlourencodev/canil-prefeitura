// scripts/server.js
// Servidor unico do projeto: arquivos estaticos + API do sistema.
// Substitui a Vercel CLI (nao exige login nem conta na nuvem).
//
//   npm run dev   -> http://localhost:4173

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

const API = {
  '/api/bootstrap': require('../api/bootstrap'),
  '/api/login': require('../api/login'),
  '/api/storage': require('../api/storage'),
  '/api/upload': require('../api/upload'),
};

const BLOQUEADOS = new Set(['.sqlite', '.sqlite-wal', '.sqlite-shm']);

function responderJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function tratarApi(req, res, rota) {
  const handler = API[rota];
  if (!handler) {
    responderJson(res, 404, { error: 'Endpoint não encontrado.' });
    return;
  }

  try {
    await handler(req, res);
  } catch (erro) {
    if (!res.writableEnded) {
      responderJson(res, erro.statusCode || 500, {
        error: erro.message || 'Erro interno do servidor.',
      });
    }
    console.error(`[api] ${rota}:`, erro);
  }
}

function servirEstatico(req, res, caminhoUrl) {
  const relativo = decodeURIComponent(caminhoUrl).replace(/^\/+/, '') || 'index.html';
  const destino = path.resolve(ROOT, relativo);

  if (!destino.startsWith(ROOT)) {
    res.statusCode = 403;
    res.end('Acesso negado');
    return;
  }

  if (BLOQUEADOS.has(path.extname(destino).toLowerCase())) {
    res.statusCode = 403;
    res.end('Acesso negado');
    return;
  }

  fs.stat(destino, (erro, stats) => {
    if (erro || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Página não encontrada');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', MIME[path.extname(destino).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    fs.createReadStream(destino).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const rota = url.pathname.replace(/\/+$/, '') || '/';

  if (rota.startsWith('/api/')) {
    void tratarApi(req, res, rota);
    return;
  }

  servirEstatico(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`Canil de Vilhena em http://localhost:${PORT}`);
  console.log('Banco: db/canil.sqlite | Imagens: uploads/');
});