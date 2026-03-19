const { getSupabaseAdmin, readRawBody, gerarToken } = require('./_supabase');

// Verifica senha armazenada como base64 (btoa no browser)
function verificarSenha(senha, senhaHash) {
  try {
    const decoded = Buffer.from(String(senhaHash || ''), 'base64').toString('utf8');
    return decoded === senha;
  } catch {
    return false;
  }
}

function delay(minMs, inicio) {
  const elapsed = Date.now() - inicio;
  const remaining = minMs - elapsed;
  return remaining > 0 ? new Promise((r) => setTimeout(r, remaining)) : Promise.resolve();
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método não permitido.' }));
    return;
  }

  const inicio = Date.now();

  let body;
  try {
    const raw = await readRawBody(req);
    body = JSON.parse(raw.toString('utf8'));
  } catch {
    await delay(300, inicio);
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Corpo da requisição inválido.' }));
    return;
  }

  const login = String(body?.login || '').trim().toLowerCase();
  const senha = String(body?.senha || '');

  if (!login || !senha) {
    await delay(300, inicio);
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Login e senha são obrigatórios.' }));
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    await delay(300, inicio);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Erro de configuração do servidor.' }));
    return;
  }

  const { data, error } = await supabase
    .from('app_storage')
    .select('valor')
    .eq('chave', 'pv_usuarios')
    .single();

  if (error || !data) {
    await delay(300, inicio);
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Usuário ou senha inválidos.' }));
    return;
  }

  let usuarios;
  try {
    usuarios = JSON.parse(data.valor);
  } catch {
    await delay(300, inicio);
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Usuário ou senha inválidos.' }));
    return;
  }

  const usuario = Array.isArray(usuarios)
    ? usuarios.find((u) => String(u.login || '').toLowerCase() === login && u.ativo === true)
    : null;

  const senhaValida = usuario && verificarSenha(senha, String(usuario.senhaHash || ''));

  await delay(300, inicio);

  if (!senhaValida) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Usuário ou senha inválidos.' }));
    return;
  }

  let token;
  try {
    token = gerarToken({
      id: usuario.id,
      login: usuario.login,
      nome: usuario.nome,
      perfil: usuario.perfil,
    });
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Erro ao gerar sessão.' }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    token,
    usuario: {
      id: usuario.id,
      login: usuario.login,
      nome: usuario.nome,
      perfil: usuario.perfil,
    },
  }));
};
