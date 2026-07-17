# Histórico de Alteração: Correção da Resolução do RIP para Contratos Anteriores na Aba 3 - 20260710_1010

## 1. Estado Anterior (Antes)
```javascript
  // Carregar dados de contratos anteriores da tabela_spu
  let contratosAnterioresData = [];
  (async function() {
    const rip = localStorage.getItem('CURRENT_PROCESS_ID') || window.processId;
    console.log(`[foco-03] RIP para contratos: "${rip}", fetchSPU existe: ${typeof window.fetchSPU}`);
    if (!rip || typeof window.fetchSPU !== 'function') {
      console.warn('[foco-03] RIP ou fetchSPU não disponível');
      return;
    }
    try {
      const dadosSPU = await window.fetchSPU(rip);
      console.log('[foco-03] Resultado fetchSPU:', dadosSPU);
      if (dadosSPU && dadosSPU.contratos_anteriores) {
        contratosAnterioresData = dadosSPU.contratos_anteriores;
        renderContratosAnteriores();
      }
    } catch(e) { console.error('[foco-03] Erro ao carregar dados SPU:', e); }
  })();
```

---

## 2. Estado Novo (Depois)
```javascript
  // Carregar dados de contratos anteriores da tabela_spu
  let contratosAnterioresData = [];
  (async function() {
    const processId = localStorage.getItem('CURRENT_PROCESS_ID') || window.processId;
    console.log(`[foco-03] ProcessId para contratos: "${processId}", fetchSPU existe: ${typeof window.fetchSPU}`);
    if (!processId || typeof window.fetchSPU !== 'function') {
      console.warn('[foco-03] ProcessId ou fetchSPU não disponível');
      return;
    }

    // 1. Resolve o RIP real a partir do processId (requerimento)
    let rip = null;
    const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
    const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);
    if (SUPA_URL && SUPA_KEY) {
      try {
        const urlInd = `${SUPA_URL}/rest/v1/tabela_indicacao?select=dados_json&numero_requerimento=eq.${processId}`;
        const resInd = await fetch(urlInd, {
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
        });
        if (resInd.ok) {
          const rows = await resInd.json();
          if (rows[0] && rows[0].dados_json && rows[0].dados_json.rips && rows[0].dados_json.rips.length > 0) {
            rip = rows[0].dados_json.rips[0];
            console.log(`[foco-03] RIP resolvido para contratos: ${rip}`);
          }
        }
      } catch(e) {
        console.warn('[foco-03] Erro ao buscar RIP na tabela_indicacao para contratos:', e);
      }
    }

    // Fallback se não resolvido
    if (!rip) {
      rip = processId;
      console.log(`[foco-03] Usando processId como RIP fallback para contratos: ${rip}`);
    }

    try {
      const dadosSPU = await window.fetchSPU(rip);
      console.log('[foco-03] Resultado fetchSPU para contratos:', dadosSPU);
      if (dadosSPU && dadosSPU.contratos_anteriores) {
        contratosAnterioresData = dadosSPU.contratos_anteriores;
        renderContratosAnteriores();
      }
    } catch(e) { console.error('[foco-03] Erro ao carregar dados SPU:', e); }
  })();
```

---

## 3. Plano de Rollback / Desfazer
Para reverter:
1. Reverter `foco-03.html` para a versão anterior substituindo o bloco de carregamento assíncrono pelo bloco do "Estado Anterior".
