# Retorno Direto de Devoluções e Normalização de Checkpoints na Aba 7

## Problema Relatado
O usuário relatou que, ao sanear (corrigir) uma devolução pendente na Aba 1 e retornar para a Aba 7 (logado como Chefia), o bloco "Verificação" (manifestação da Chefia) não aparecia novamente para que ele pudesse dar continuidade ao fluxo.

## Análise da Causa Raiz (Root Cause)
Foram identificados dois gargalos técnicos correlacionados:

1. **Inexistência de Rota de Retorno Direto:** 
   Quando a Chefia (etapa 5) devolvia um processo à Aba 1 (etapa 12) para saneamento de RIP, ao salvar a correção na Aba 1 o usuário clicava em "Enviar para o setor de Caracterização", o que forçava o status a ir para a etapa 3 ("Aguardando Diagnóstico de Imóvel"). O processo ficava na fila da equipe de Caracterização, exigindo que passasse novamente por todas as aprovações das Abas 2 e 3 até chegar na Chefia (Aba 7). O fluxo ficava muito longo (excessivos cliques) e impedia a Chefia de verificar a correção de imediato.

2. **Divergência de String de Checkpoint (Mismatch):**
   A tabela de estágios (`_WORKFLOW_STAGES` em `db.js`) define o status da Chefia como `"Aguardando Validação da Chefia"`. No entanto, a lógica do controle RBAC na Aba 7 (`aba7.html`) verificava a exibição do bloco de manifestação buscando a string `"Aguardando Chefia SPU/UF"` ou `"Devolvido para Chefia SPU/UF"`. Por conta dessa inconsistência textual, o bloco da Chefia permanecia invisível mesmo se o processo chegasse no estágio 5.

## Soluções Implementadas

### 1. Rota de Retorno Direto de Devoluções (`db.js`)
Alteramos o motor de workflow `updateStatusFluxo` para gravar e respeitar um histórico de retorno:
* **Ao Devolver:** Se o processo é movido para uma etapa de devolução (`tag_fluxo === "Devolvido"`), o sistema grava no JSON de status o ID da etapa de origem no atributo `retorno_devolucao_id` (ex: se a Chefia devolveu, `retorno_devolucao_id = 5`).
* **Ao Sanear/Enviar:** Quando o usuário corrige os dados e submete a aba, a função `updateStatusFluxo` intercepta o envio. Se houver um `retorno_devolucao_id` gravado e a nova etapa não for uma nova devolução, o sistema redireciona o processo diretamente para a etapa que requisitou a devolução original (bypassando as etapas intermediárias desnecessárias) e remove o `retorno_devolucao_id`.

### 2. Normalização de Checkpoints na Aba 7 (`aba7.html`)
Atualizamos as condições da função `applyProfileView` em `aba7.html` para aceitar tanto os status mapeados no workflow quanto as strings de legado, evitando qualquer bloqueio de visualização por mismatch de texto:
* **Chefia:** Aceita `"Aguardando Chefia SPU/UF"`, `"Devolvido para Chefia SPU/UF"` e `"Aguardando Validação da Chefia"`.
* **Coordenação:** Aceita `"Aguardando Coordenação SPU/UF"`, `"Devolvido para Coordenação SPU/UF"` e `"Aguardando Validação da Coordenação"`.
* **Superintendência:** Aceita `"Aguardando Superintendência"`, `"Devolvido para Superintendência"` e `"Aguardando Deliberação da Superintendência"`.
* **Equipe C.G.:** Aceita `"Aguardando Equipe C.G."`, `"Devolvido para Equipe C.G."` e `"Aguardando Validação da Equipe C.G."`.
* **Coordenação-Geral:** Aceita `"Aguardando Coordenação-Geral"`, `"Devolvido para Coordenação-Geral"` e `"Aguardando Validação da Coordenação-Geral"`.

---

## Estado Anterior (Antes)

### Em `db.js`:
```javascript
    let stage = _WORKFLOW_STAGES[workflowId];
    if (!stage && typeof workflowId === 'string') {
        // Fallback for old strings
        let fallbackTag = customTagFluxo || "Em andamento";
        if (oldStatusGeral === 'Devolvido') fallbackTag = "Devolvido";
        stage = { tag_fluxo: fallbackTag, status: workflowId, instancia: oldStatusGeral || workflowId, perfil: customPerfil || "-" };
    } else if (!stage) {
        console.error("Workflow ID não encontrado:", workflowId);
        return;
    }

    try {
        const urlGet = `${SUPABASE_URL}/rest/v1/tabela_status_fluxo?select=id,dados_json&numero_requerimento=eq.${encodeURIComponent(processId)}&order=id.desc`;
        const resGet = await fetch(urlGet, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        
        let json = {};
        let existe = false;
        if (resGet.ok) {
            const data = await resGet.json();
            if (data.length > 0) {
                existe = true;
                json = data[0].dados_json ? data[0].dados_json : {};
            }
        }
```

### Em `aba7.html`:
```javascript
            if (id === 'bloco-deliberacao-chefia') {
              shouldShow = (currentCheckpoint === "Aguardando Chefia SPU/UF" || currentCheckpoint === "Devolvido para Chefia SPU/UF");
            } else if (id === 'bloco-deliberacao-coord') {
              shouldShow = (currentCheckpoint === "Aguardando Coordenação SPU/UF" || currentCheckpoint === "Devolvido para Coordenação SPU/UF");
            } else if (id === 'bloco-deliberacao-super') {
              shouldShow = (currentCheckpoint === "Aguardando Superintendência" || currentCheckpoint === "Devolvido para Superintendência");
            } else if (id === 'bloco-deliberacao-equipe-cg') {
              shouldShow = (currentCheckpoint === "Aguardando Equipe C.G." || currentCheckpoint === "Devolvido para Equipe C.G.");
            } else if (id === 'bloco-deliberacao-coord-geral') {
              shouldShow = (currentCheckpoint === "Aguardando Coordenação-Geral" || currentCheckpoint === "Devolvido para Coordenação-Geral");
            }
```

---

## Estado Novo (Depois)

### Em `db.js`:
```javascript
    let json = {};
    let existe = false;

    try {
        const urlGet = `${SUPABASE_URL}/rest/v1/tabela_status_fluxo?select=id,dados_json&numero_requerimento=eq.${encodeURIComponent(processId)}&order=id.desc`;
        const resGet = await fetch(urlGet, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
        });
        
        if (resGet.ok) {
            const data = await resGet.json();
            if (data.length > 0) {
                existe = true;
                json = data[0].dados_json ? data[0].dados_json : {};
            }
        }

        let finalWorkflowId = workflowId;
        const initialStage = _WORKFLOW_STAGES[workflowId];
        
        if (existe && json.retorno_devolucao_id && initialStage && initialStage.tag_fluxo !== "Devolvido") {
            console.log(`🔄 [db.js] Processo saneado! Redirecionando de ID ${workflowId} de volta para a etapa de origem: ${json.retorno_devolucao_id}`);
            finalWorkflowId = json.retorno_devolucao_id;
            delete json.retorno_devolucao_id;
        }

        let stage = _WORKFLOW_STAGES[finalWorkflowId];
        if (!stage && typeof finalWorkflowId === 'string') {
            let fallbackTag = customTagFluxo || "Em andamento";
            if (oldStatusGeral === 'Devolvido') fallbackTag = "Devolvido";
            stage = { tag_fluxo: fallbackTag, status: finalWorkflowId, instancia: oldStatusGeral || finalWorkflowId, perfil: customPerfil || "-" };
        } else if (!stage) {
            console.error("Workflow ID não encontrado:", finalWorkflowId);
            return;
        }

        if (stage.tag_fluxo === "Devolvido") {
            if (json.id_workflow) {
                json.retorno_devolucao_id = json.id_workflow;
                console.log(`💾 [db.js] Salvando retorno_devolucao_id = ${json.retorno_devolucao_id}`);
            }
        }
```

### Em `aba7.html`:
```javascript
            if (id === 'bloco-deliberacao-chefia') {
              shouldShow = (currentCheckpoint === "Aguardando Chefia SPU/UF" || currentCheckpoint === "Devolvido para Chefia SPU/UF" || currentCheckpoint === "Aguardando Validação da Chefia");
            } else if (id === 'bloco-deliberacao-coord') {
              shouldShow = (currentCheckpoint === "Aguardando Coordenação SPU/UF" || currentCheckpoint === "Devolvido para Coordenação SPU/UF" || currentCheckpoint === "Aguardando Validação da Coordenação");
            } else if (id === 'bloco-deliberacao-super') {
              shouldShow = (currentCheckpoint === "Aguardando Superintendência" || currentCheckpoint === "Devolvido para Superintendência" || currentCheckpoint === "Aguardando Deliberação da Superintendência");
            } else if (id === 'bloco-deliberacao-equipe-cg') {
              shouldShow = (currentCheckpoint === "Aguardando Equipe C.G." || currentCheckpoint === "Devolvido para Equipe C.G." || currentCheckpoint === "Aguardando Validação da Equipe C.G.");
            } else if (id === 'bloco-deliberacao-coord-geral') {
              shouldShow = (currentCheckpoint === "Aguardando Coordenação-Geral" || currentCheckpoint === "Devolvido para Coordenação-Geral" || currentCheckpoint === "Aguardando Validação da Coordenação-Geral");
            }
```

---

## Plano de Rollback / Desfazer
1. Reverter o arquivo `db.js` restaurando as linhas de `updateStatusFluxo` ao modelo anterior.
2. Reverter o arquivo `aba7.html` na função `applyProfileView` para suas verificações estritas originais.
