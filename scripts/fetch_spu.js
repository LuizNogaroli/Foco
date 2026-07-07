// scripts/fetch_spu.js
// Expose a global fetch function for the browser (used by foco-02.js)
// Credentials come from db.js which is loaded by the parent (index.html).
// In an iframe, window.parent holds the parent window where db.js set these globals.
window.fetchSPU = async function (rip) {
  // Try local window first, then parent window (iframe scenario)
  const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
  const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);

  if (!SUPA_URL || !SUPA_KEY) {
    console.error('[fetch_spu] SUPABASE_URL ou SUPABASE_ANON_KEY não definidos (nem local, nem no parent)');
    return {};
  }
  // A coluna na tabela_spu é "numero_rip", não "rip"
  const url = `${SUPA_URL}/rest/v1/tabela_spu?select=*&numero_rip=eq.${rip}`;
  console.log(`🔍 [fetch_spu] Buscando RIP ${rip}: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Os dados reais ficam dentro de dados_json
    const row = data[0] || {};
    return row.dados_json || row || {};
  } catch (e) {
    console.error('⚠️ [fetch_spu] Falha ao buscar dados do RIP', e);
    return {};
  }
};
