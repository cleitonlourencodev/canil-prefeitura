// api/login.js
// Autenticacao dos operadores do sistema (admin, veterinario, atendente).
// Senhas guardadas em base64, como no restante do projeto de demonstracao.

const { CHAVES, ler, readRawBody, gerarToken, usuarioDoToken } = require('./_db');

function compararSenha(senha, senhaHash) {
  return Buffer.from(String(senha)).toString('base64') === String(senhaHash || '');
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // GET valida a sessao atual do navegador
  if (req.method === 'GET') {
    const usuario = usuarioDoToken(req);
    if (!usuario) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Sessão inválida ou expirada.' }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, usuario }));
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método não permitido.' }));
    return;
  }

  const raw = await readRawBody(req);
  let credenciais = {};
  try {
    credenciais = raw.length ? JSON.parse(raw.toString('utf8')) : {};
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Credenciais inválidas.' }));
    return;
  }

  const login = String(credenciais.login || '').trim().toLowerCase();
  const senha = String(credenciais.senha || '');
  const bruto = ler(CHAVES.usuarios);
  let usuarios = [];
  try {
    usuarios = bruto ? JSON.parse(bruto) : [];
  } catch {
    usuarios = [];
  }

  if (!login || !senha) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Informe login e senha.' }));
    return;
  }

  const usuario = (Array.isArray(usuarios) ? usuarios : []).find(
    (item) => String(item.login || '').trim().toLowerCase() === login,
  );

  if (!usuario || !compararSenha(senha, usuario.senhaHash)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Login ou senha incorretos.' }));
    return;
  }

  if (usuario.ativo === false) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'Usuário desativado. Procure o administrador.' }));
    return;
  }

  const token = gerarToken({
    sub: usuario.id,
    nome: usuario.nome,
    login: usuario.login,
    perfil: usuario.perfil,
  });

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        perfil: usuario.perfil,
        email: usuario.email || '',
        cpf: usuario.cpf || '',
        telefone: usuario.telefone || '',
        cargo: usuario.cargo || '',
      },
    }),
  );
};