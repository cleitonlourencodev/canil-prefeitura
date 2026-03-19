const { getSupabaseAdmin, getStorageBucket, readRawBody, sanitizeFileName, verificarToken, extrairToken } = require('./_supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Método não permitido.' }));
      return;
    }

    // Upload exige autenticação
    const dadosToken = verificarToken(extrairToken(req));
    if (!dadosToken) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Não autorizado.' }));
      return;
    }

    const folder = String(req.query.folder || 'geral').trim() || 'geral';
    const originalName = decodeURIComponent(String(req.headers['x-file-name'] || 'arquivo'));
    const contentType = String(req.headers['x-file-type'] || 'application/octet-stream');
    const fileBody = await readRawBody(req);

    if (!fileBody.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Arquivo vazio.' }));
      return;
    }

    const safeName = sanitizeFileName(originalName);
    const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const bucket = getStorageBucket();
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBody, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      path: filePath,
      bucket,
      publicUrl: data.publicUrl,
    }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Erro interno.' }));
  }
};
