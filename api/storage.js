// api/storage.js
// Persistencia chave/valor usada pelo front-end (app_storage no SQLite).
// Leitura e sempre liberada; escrita exige sessao, exceto para as chaves
// publicas preenchidas pelo proprio site (interesses e denuncias).

const { CHAVES_PROTEGIDAS, lerTudo, ler, gravar, remover, readJsonBody, usuarioDoToken } = require('./_db');

const CHAVES_PUBLICAS = new Set([
  'pv_interesses_adocao',
  'pv_denuncias',
  'pv_auditoria_logs',
]);

function semSenhas(valor) {
  const dados = JSON.parse(valor);
  if (!Array.isArray(dados)) return valor;

  const seguro = dados.map((usuario) => {
    const copia = { ...usuario };
    delete copia.senhaHash;
    return copia;
  });

  return JSON.stringify(seguro);
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    const itens = {};

    let tudo = {};
    try {
      tudo = lerTudo();
    } catch {
      // Banco indisponivel: front-end usa os padroes locais.
    }

    for (const [chave, valor] of Object.entries(tudo)) {
      if (CHAVES_PROTEGIDAS.has(chave)) {
        try {
          itens[chave] = semSenhas(valor);
          continue;
        } catch {
          itens[chave] = '[]';
          continue;
        }
      }
      itens[chave] = valor;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, items: itens }));
    return;
  }

  if (req.method === 'POST' || req.method === 'DELETE') {
    const usuario = usuarioDoToken(req);
    let corpo = {};

    try {
      corpo = await readJsonBody(req);
    } catch (erro) {
      res.statusCode = erro.statusCode || 400;
      res.end(JSON.stringify({ error: erro.message }));
      return;
    }

    const key = String(corpo.key || '').trim();
    if (!key) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Chave não informada.' }));
      return;
    }

    const escritaPublica = CHAVES_PROTEGIDAS.has(key) || CHAVES_PUBLICAS.has(key);

    if (!usuario && !escritaPublica) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Sem permissão para alterar esta chave.' }));
      return;
    }

    if (req.method === 'POST') {
      gravar(key, corpo.value);
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (!usuario) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Sem permissão para remover esta chave.' }));
      return;
    }

    const removido = remover(key);
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, removido }));
    return;
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Método não permitido.' }));
};