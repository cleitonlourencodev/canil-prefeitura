// api/upload.js
// Recebe as fotos do painel do sistema e grava em uploads/<pasta>/ no repositorio.
// O caminho devolvido e relativo ao site, entao funciona sem configuracao externa.

const fs = require('node:fs');
const path = require('node:path');

const {
  registrarUpload,
  caminhoRelativoUpload,
  sanitizeFileName,
  garantirPastaUpload,
  readRawBody,
  usuarioDoToken,
} = require('./_db');

const EXTENSAO_POR_MIME = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function formatarTamanho(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método não permitido.' }));
    return;
  }

  if (!usuarioDoToken(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Faça login no sistema para enviar imagens.' }));
    return;
  }

  const contentType = String(req.headers['content-type'] || '');
  if (!contentType.startsWith('multipart/form-data')) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Envie o arquivo no formato multipart.' }));
    return;
  }

  let corpo;
  try {
    corpo = await readRawBody(req);
  } catch (erro) {
    res.statusCode = erro.statusCode || 400;
    res.end(JSON.stringify({ error: erro.message }));
    return;
  }

  const limite = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!limite) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Boundary do formulário inválido.' }));
    return;
  }

  const boundary = Buffer.from(`--${(limite[1] || limite[2]).trim()}`);
  const partes = [];
  let inicio = corpo.indexOf(boundary);

  while (inicio !== -1) {
    const proximo = corpo.indexOf(boundary, inicio + boundary.length);
    if (proximo === -1) break;
    partes.push(corpo.slice(inicio + boundary.length, proximo));
    inicio = proximo;
  }

  let pasta = 'pets';
  let nomeOriginal = '';
  let tipoArquivo = '';
  let bufferArquivo = null;

  for (const parte of partes) {
    const separacao = parte.indexOf('\r\n\r\n');
    if (separacao === -1) continue;

    const cabecalho = parte.slice(0, separacao).toString('utf8');
    const nomeCampo = cabecalho.match(/name="([^"]*)"/i)?.[1] || '';
    const nomeArquivoPais = cabecalho.match(/filename="([^"]*)"/i)?.[1] || '';
    let conteudo = parte.slice(separacao + 4);
    if (conteudo.subarray(-2).toString() === '\r\n') conteudo = conteudo.subarray(0, -2);

    if (!nomeCampo) continue;
    if (nomeCampo === 'folder') {
      pasta = conteudo.toString('utf8').trim();
      continue;
    }
    if (nomeCampo === 'file' && nomeArquivoPais) {
      nomeOriginal = decodeURIComponent(nomeArquivoPais.replace(/\+/g, ' '));
      tipoArquivo = cabecalho.match(/Content-Type:\s*([^\r\n]+)/i)?.[1]?.trim() || '';
      bufferArquivo = conteudo;
    }
  }

  if (!bufferArquivo || !nomeOriginal) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Nenhum arquivo recebido.' }));
    return;
  }

  const extensao = path.extname(sanitizeFileName(nomeOriginal)).toLowerCase() ||
    EXTENSAO_POR_MIME[String(tipoArquivo).toLowerCase()] ||
    '.jpg';

  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extensao)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Formato de imagem não suportado.' }));
    return;
  }

  const destinoPasta = garantirPastaUpload(pasta);
  const base = sanitizeFileName(path.basename(nomeOriginal, path.extname(nomeOriginal))) || 'imagem';
  const nomeFinal = `${Date.now()}-${base}${extensao}`;
  const caminhoFinal = path.join(destinoPasta.caminho, nomeFinal);

  fs.writeFileSync(caminhoFinal, bufferArquivo);

  registrarUpload({
    pasta: destinoPasta.nome,
    arquivo: nomeFinal,
    caminho: caminhoFinal,
    contentType: tipoArquivo,
    tamanho: bufferArquivo.length,
    enviadoPor: usuarioDoToken(req)?.login || '',
  });

  const publicUrl = caminhoRelativoUpload(caminhoFinal);

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, publicUrl, path: publicUrl, name: nomeFinal, size: formatarTamanho(bufferArquivo.length) }));
};