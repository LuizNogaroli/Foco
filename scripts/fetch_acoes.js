// scripts/fetch_acoes.js
// Expose a global fetchAcoes function for the browser (used by foco-03.js)
window.fetchAcoes = async function (processId) {
  const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
  const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);

  if (!SUPA_URL || !SUPA_KEY) {
    console.error('[fetch_acoes] SUPABASE_URL ou SUPABASE_ANON_KEY não definidos');
    return null;
  }

  const headers = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` };

  // 1. Busca o RIP a partir do process_id via tabela_indicacao
  let rip = null;
  try {
    const urlInd = `${SUPA_URL}/rest/v1/tabela_indicacao?select=dados_json&numero_requerimento=eq.${processId}`;
    const resInd = await fetch(urlInd, { headers });
    if (resInd.ok) {
      const rows = await resInd.json();
      if (rows[0] && rows[0].dados_json && rows[0].dados_json.rips && rows[0].dados_json.rips.length > 0) {
        rip = rows[0].dados_json.rips[0];
        console.log(`[fetch_acoes] RIP encontrado via tabela_indicacao: ${rip}`);
      }
    }
  } catch(e) { console.warn('[fetch_acoes] Erro ao buscar RIP na tabela_indicacao:', e); }

  // 2. Fallback: tenta usar o processId direto como RIP
  if (!rip) {
    rip = processId;
    console.log(`[fetch_acoes] Usando processId como RIP: ${rip}`);
  }

  // 3. Busca na tabela_acoes
  const url = `${SUPA_URL}/rest/v1/tabela_acoes?select=*&rip=eq.${rip}`;
  console.log(`[fetch_acoes] Buscando ações: ${url}`);
  try {
    const res = await fetch(url, { headers });
    const text = await res.text();
    console.log(`[fetch_acoes] Status ${res.status}, body: ${text.substring(0, 300)}`);
    if (!res.ok) {
      console.error(`[fetch_acoes] Erro HTTP ${res.status}: ${text}`);
      return null;
    }
    const data = JSON.parse(text);
    return data[0] || null;
  } catch (e) {
    console.error('[fetch_acoes] Falha ao buscar ações do RIP', e);
    return null;
  }
};
