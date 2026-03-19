const { getSupabaseAdmin, verificarToken, extrairToken } = require('./_supabase');

// Chaves que o público pode gravar sem estar autenticado (envio de formulários)
const PUBLIC_WRITE_KEYS = new Set(['pv_denuncias', 'pv_interesses_adocao']);

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const supabase = getSupabaseAdmin();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('app_storage')
        .select('chave, valor');

      if (error) {
        throw error;
      }

      // Monta objeto de itens, removendo senhaHash dos usuários antes de enviar ao cliente
      const items = {};
      for (const item of (data || [])) {
        if (item.chave === 'pv_usuarios') {
          try {
            const usuarios = JSON.parse(item.valor);
            const seguros = Array.isArray(usuarios)
              ? usuarios.map(({ senhaHash, ...rest }) => rest) // eslint-disable-line no-unused-vars
              : usuarios;
            items[item.chave] = JSON.stringify(seguros);
          } catch {
            items[item.chave] = String(item.valor ?? '');
          }
        } else {
          items[item.chave] = String(item.valor ?? '');
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ items }));
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const key = String(body.key || '').trim();
      const value = String(body.value ?? '');

      if (!key) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Chave obrigatória.' }));
        return;
      }

      // Chaves privadas exigem autenticação
      if (!PUBLIC_WRITE_KEYS.has(key)) {
        const dadosToken = verificarToken(extrairToken(req));
        if (!dadosToken) {
          res.statusCode = 401;
          res.end(JSON.stringify({ error: 'Não autorizado.' }));
          return;
        }
      }

      const { error } = await supabase
        .from('app_storage')
        .upsert({ chave: key, valor: value }, { onConflict: 'chave' });

      if (error) {
        throw error;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const key = String(body.key || req.query?.key || '').trim();

      if (!key) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Chave obrigatória.' }));
        return;
      }

      // DELETE sempre exige autenticação
      const dadosToken = verificarToken(extrairToken(req));
      if (!dadosToken) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Não autorizado.' }));
        return;
      }

      const { error } = await supabase
        .from('app_storage')
        .delete()
        .eq('chave', key);

      if (error) {
        throw error;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método não permitido.' }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Erro interno.' }));
  }
};
