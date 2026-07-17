// db.js
// Controlador central de estado e conexão com o Supabase (PostgreSQL)
// Este arquivo é carregado pelo index.html e expée funéées globais para os iframes.

// =========================================================================
// ATENééO: COLE SUAS CHAVES DO SUPABASE ABAIXO
// =========================================================================
const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

window.supabaseClient = null;
window.formDataState = {};
window.isSaving = false;

// Inicializa o cliente do Supabase se o SDK foi carregado via CDN
if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    if (SUPABASE_URL !== "SUA_URL_DO_SUPABASE" && SUPABASE_ANON_KEY !== "SUA_CHAVE_ANON_DO_SUPABASE") {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log(" Cliente Supabase inicializado com sucesso.");
    } else {
        console.warn("é URL ou Chave Anon do Supabase não configuradas no db.js. O sistema funcionaré apenas em meméria temporéria.");
    }
} else {
    console.error("L SDK do Supabase não foi carregado. Verifique a importaééo no index.html.");
}

// Identificador exclusivo do rascunho de simulaééo lido dinamicamente da URL ou LocalStorage
const urlParams = new URLSearchParams(window.location.search);
let PROCESS_ID = urlParams.get('id') || urlParams.get('process_id');

// Tenta recuperar do localStorage se a URL perdeu os parémetros (ex: roteamento SPA ou Next.js)
if (!PROCESS_ID) {
    PROCESS_ID = localStorage.getItem('CURRENT_PROCESS_ID');
}
if (!PROCESS_ID) {
    PROCESS_ID = 'processo-admissibilidade-foco';
}

// =========================================================================
// OPERAééES DE BANCO DE DADOS (RASCUNHOS / DRAFTS)
// =========================================================================

// Carrega os dados salvos do banco de dados no carregamento inicial da página
async function loadDraftFromDB() {
    if (!PROCESS_ID) return;

    try {
        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        };

        // 1. Tenta buscar da tabela_foco (dados das abas 2 em diante)
        const focoUrl = SUPABASE_URL + '/rest/v1/tabela_foco?select=dados_json&numero_requerimento=eq.' + PROCESS_ID;
        let resFoco = await fetch(focoUrl, { headers });
        let dataFoco = await resFoco.json();
        let focoJson = (dataFoco && dataFoco.length > 0) ? dataFoco[0].dados_json : {};

        // 2. Busca da tabela_requerimentos (Aba 1)
        const reqUrl = SUPABASE_URL + '/rest/v1/tabela_requerimentos?select=dados_json&numero_requerimento=eq.' + PROCESS_ID;
        let resReq = await fetch(reqUrl, { headers });
        let dataReq = await resReq.json();

        if (dataReq && dataReq.length > 0) {
            const reqJson = dataReq[0].dados_json || {};
            
            // Busca status do fluxo
            const statusUrl = SUPABASE_URL + '/rest/v1/tabela_status_fluxo?select=dados_json&numero_requerimento=eq.' + PROCESS_ID;
            let resStatus = await fetch(statusUrl, { headers });
            let dataStatus = await resStatus.json();
            let statusJson = (dataStatus && dataStatus.length > 0) ? dataStatus[0].dados_json : {};

            // Mapeia o novo modelo pro formato que o frontend antigo espera nas views html!
            window.formDataState = {
                ...focoJson,
                campo11: PROCESS_ID,
                campo12: reqJson.data_req || '',
                campo13: reqJson.processo_sei || '',
                campo14: reqJson.cpf_cnpj || '',
                campo15: reqJson.interessado || '',
                campo19: reqJson.telefone || '',
                campo17: reqJson.pessoa_estrangeira || 'Não',
                prioridade_legal: reqJson.prioridade_legal || 'Não se aplica',
                campo14_rep: reqJson.cpf_cnpj_rep || '',
                campo15_rep: reqJson.nome_rep || '',
                campo19_rep: reqJson.telefone_rep || '',
                uf: reqJson.uf || '',
                municipio: reqJson.municipio || '',
                procedimento: reqJson.regime_requerido || '',
                tipo_requerimento: reqJson.tipo_requerimento || '',
                documentos_anexados: reqJson.documentos_anexados || [],
                
                status: statusJson.status_geral || 'Aguardando Análise',
                status_flow: statusJson.checkpoint || 'SPU/' + (reqJson.uf || 'ND')
            };

            console.log('Dados carregados da nova arquitetura:', window.formDataState);
            
            // Transição de Status
            if (window.formDataState.status === 'Aguardando Análise' || window.formDataState.status === 'Aguardando análise') {
                window.formDataState.status = 'Em análise';
                // Salvar a transição de status na tabela nova
                // TODO: Fazer update real na tabela de status depois.
            }
        } else {
            console.error('Processo não encontrado na tabela_requerimentos!');
            return;
        }

        // Dispara o evento para os iframes preencherem os campos na tela
        const iframe = document.getElementById('frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'DATABASE_LOADED', data: window.formDataState }, '*');
        }

    } catch (err) {
        console.error('Erro inesperado ao carregar processo:', err);
    }
}

// Função com debounce de 1 segundo para evitar chamadas excessivas de rede
let saveTimeout = null;
async function executeSaveDraft() {
    window.isSaving = true;
    try {
        // Envia evento para colher os dados atuais do iframe
        const iframe = document.getElementById('frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'REQUEST_SAVE' }, '*');
        }

        // Dá um tempinho para o iframe responder com os dados atualizados
        await new Promise(r => setTimeout(r, 200));

        let payload = { ...window.formDataState };
        payload.updated_at = new Date().toISOString();

        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        };

        // 1. Atualizar a tabela_requerimentos (Aba 1)
        const reqPayload = {
            data_req: payload.campo12,
            processo_sei: payload.campo13,
            cpf_cnpj: payload.campo14,
            interessado: payload.campo15,
            telefone: payload.campo19,
            pessoa_estrangeira: payload.campo17,
            prioridade_legal: payload.prioridade_legal,
            cpf_cnpj_rep: payload.campo14_rep,
            nome_rep: payload.campo15_rep,
            telefone_rep: payload.campo19_rep,
            uf: payload.uf,
            municipio: payload.municipio,
            regime_requerido: payload.procedimento,
            documentos_anexados: payload.documentos_anexados || []
        };

        await fetch(SUPABASE_URL + '/rest/v1/tabela_requerimentos?numero_requerimento=eq.' + PROCESS_ID, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ dados_json: reqPayload, updated_at: new Date().toISOString() })
        });

        // 2. Salvar na tabela_foco as análises técnicas (Abas 2+) usando UPSERT
        const postData = {
            numero_requerimento: PROCESS_ID,
            dados_json: payload,
            updated_at: new Date().toISOString()
        };

        const url = SUPABASE_URL + '/rest/v1/tabela_foco';
        const res = await fetch(url, {
            method: 'POST',
            headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
            body: JSON.stringify(postData)
        });

        if (!res.ok) {
            console.error('Falha ao salvar análises', await res.text());
        } else {
            console.log('Análises salvas com sucesso na nova estrutura!');
            const savedMsg = document.getElementById('savedMessage');
            if (savedMsg) {
                savedMsg.style.display = 'block';
                savedMsg.style.opacity = '1';
                setTimeout(() => { savedMsg.style.opacity = '0'; }, 2000);
            }
        }
    } catch (err) {
        console.error('Erro de rede ao salvar rascunho:', err);
    } finally {
        window.isSaving = false;
    }
}

function triggerSaveDraft() {
    // Autosave desativado por solicitação do usuário.
    // O salvamento só ocorre ao chamar forceSaveDraft (Ex: botão Salvar e Avançar)
}

// Salva imediatamente, ignorando o debounce
window.forceSaveDraft = async function() {
    if (saveTimeout) clearTimeout(saveTimeout);
    await executeSaveDraft();
};

window.updateStatusFluxo = async function(processId, workflowId, oldStatusGeral, customPerfil, customTagFluxo) {
    if (!processId) return;
    
    // Check if WORKFLOW_STAGES exists globally, if not we define it here as a fallback
    const _WORKFLOW_STAGES = typeof WORKFLOW_STAGES !== 'undefined' ? WORKFLOW_STAGES : {
        1:  { id_workflow: 1,  tag_fluxo: "", status: "Aguardando análise",                           instancia: "",                    perfil: "-",                     descricao: "Aguardando iniciar a análise" },
        2:  { id_workflow: 2,  tag_fluxo: "Normal", status: "Indicação do imóvel",               instancia: "Destinação",           perfil: "Equipe (Destinação)",   descricao: "Indicação de imóvel/área" },
        3:  { id_workflow: 3,  tag_fluxo: "Normal", status: "Diagnóstico preliminar do imóvel",             instancia: "Caracterização",       perfil: "Equipe (Caracterização)", descricao: "Diagnóstico das características do imóvel" },
        4:  { id_workflow: 4,  tag_fluxo: "Normal", status: "Análise de viabilidade",            instancia: "Destinação",           perfil: "Equipe (Destinação)",   descricao: "Análise Preliminar do Imóvel" },
        5:  { id_workflow: 5,  tag_fluxo: "Normal", status: "Validação análise de viabilidade - Chefia",               instancia: "Chefia",               perfil: "Chefia",                descricao: "Validação da Chefia no âmbito da SPU/UF" },
        6:  { id_workflow: 6,  tag_fluxo: "Normal", status: "Validação análise de viabilidade - Coordenação",          instancia: "Coordenação SPU/UF",   perfil: "Coordenação",           descricao: "Validação da Coordenação no âmbito da SPU/UF" },
        7:  { id_workflow: 7,  tag_fluxo: "Normal", status: "Deliberação Superintendência",   instancia: "Superintendência",     perfil: "Superintendência",      descricao: "Deliberação da Superintendência no âmbito da SPU/UF" },
        8:  { id_workflow: 8,  tag_fluxo: "Normal", status: "Conferência análise de viabilidade",          instancia: "Equipe C.G.",          perfil: "Equipe C.G.",           descricao: "Validação da Equipe C.G. no âmbito da SPU/UC" },
        9:  { id_workflow: 9,  tag_fluxo: "Normal", status: "Validação análise de viabilidade - Coordenação-Geral",    instancia: "Coordenação-Geral SPU/UC", perfil: "Coordenação-Geral",     descricao: "Validação da Coordenação-Geral no âmbito da SPU/UC" },
        10: { id_workflow: 10, tag_fluxo: "Normal", status: "Validação conferência",              instancia: "Direção SPU/UC",       perfil: "Direção",               descricao: "Validação da Direção no âmbito da SPU/UC" },
        11: { id_workflow: 11, tag_fluxo: "Normal", status: "Manifestação CDE",                instancia: "CDE",                  perfil: "CDE",                   descricao: "Deliberação da Comissão de Destinações Especiais" },
        12: { id_workflow: 12, tag_fluxo: "Devolvido",    status: "Indicação do imóvel",               instancia: "Destinação",           perfil: "Equipe (Destinação)",     descricao: "Devolução para indicação de outro imóvel/área, acrescentar ou excluir imóvel/área" },
        13: { id_workflow: 13, tag_fluxo: "Devolvido",    status: "Diagnóstico preliminar do imóvel",             instancia: "Caracterização",       perfil: "Equipe (Caracterização)", descricao: "Devolução para ajuste na análise preliminar do imóvel/área" },
        14: { id_workflow: 14, tag_fluxo: "Devolvido",    status: "Análise de viabilidade",            instancia: "Destinação",           perfil: "Equipe (Destinação)",   descricao: "Devolução para ajuste na proposta de destinação" },
        15: { id_workflow: 15, tag_fluxo: "Devolvido",    status: "Validação análise de viabilidade - Coordenação-Geral",    instancia: "Coordenação-Geral SPU/UC", perfil: "Coordenação-Geral",     descricao: "Devolução do processo para ajustes" },
        16: { id_workflow: 16, tag_fluxo: "Devolvido",    status: "Deliberação Superintendência",   instancia: "Superintendência",     perfil: "Superintendência",      descricao: "Devolução do processo para ajustes" },
        17: { id_workflow: 17, tag_fluxo: "Normal",   status: "Concluído",                                    instancia: "Superintendência",     perfil: "Superintendência",      descricao: "Processo concluído via Superintendência" },
        18: { id_workflow: 18, tag_fluxo: "Normal",   status: "Concluído",                                    instancia: "CDE",                  perfil: "CDE",                   descricao: "Processo concluído via CDE" }
    };

    let json = {};
    let existe = false;

    try {
        // Primeiro, busca o JSON atual
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

        // Determina o ID do workflow de destino
        let finalWorkflowId = workflowId;
        const initialStage = _WORKFLOW_STAGES[workflowId];
        
        // Se já existe registro, e o novo status NÃO é devolução, mas o banco TEM retorno_devolucao_id salvo:
        if (existe && json.retorno_devolucao_id && initialStage && initialStage.tag_fluxo !== "Devolvido") {
            console.log(`🔄 [db.js] Processo saneado! Redirecionando de ID ${workflowId} de volta para a etapa de origem: ${json.retorno_devolucao_id}`);
            finalWorkflowId = json.retorno_devolucao_id;
            delete json.retorno_devolucao_id;
        }

        let stage = _WORKFLOW_STAGES[finalWorkflowId];
        if (!stage && typeof finalWorkflowId === 'string') {
            // Fallback para strings antigas
            let fallbackTag = customTagFluxo || "Normal";
            if (oldStatusGeral === 'Devolvido') fallbackTag = "Devolvido";
            stage = { tag_fluxo: fallbackTag, status: finalWorkflowId, instancia: oldStatusGeral || finalWorkflowId, perfil: customPerfil || "-" };
        } else if (!stage) {
            console.error("Workflow ID não encontrado:", finalWorkflowId);
            return;
        }

        // Se o NOVO estágio for do tipo "Devolvido", grava o retorno_devolucao_id
        if (stage.tag_fluxo === "Devolvido") {
            if (json.id_workflow) {
                json.retorno_devolucao_id = json.id_workflow;
                console.log(`💾 [db.js] Salvando retorno_devolucao_id = ${json.retorno_devolucao_id} (Etapa anterior à devolução)`);
            }
        }
        
        // --- INÍCIO DA LÓGICA DE KPI (TIMESTAMPS) ---
        const nowIso = new Date().toISOString();
        
        if (!json.data_inicio_processo) {
            json.data_inicio_processo = nowIso;
        }
        if (!json.historico_tramitacao || !Array.isArray(json.historico_tramitacao)) {
            json.historico_tramitacao = [];
        }
        
        // Carimba a data_saida da instância anterior se houver mudança de estado
        if (json.historico_tramitacao.length > 0) {
            const lastEntry = json.historico_tramitacao[json.historico_tramitacao.length - 1];
            if (!lastEntry.data_saida && (lastEntry.instancia !== stage.instancia || lastEntry.status !== stage.status)) {
                lastEntry.data_saida = nowIso;
            }
        }
        
        // Registra a nova entrada se mudou de estado
        const isSameState = json.historico_tramitacao.length > 0 && 
                            json.historico_tramitacao[json.historico_tramitacao.length - 1].instancia === stage.instancia &&
                            json.historico_tramitacao[json.historico_tramitacao.length - 1].status === stage.status;
                            
        if (!isSameState) {
            json.historico_tramitacao.push({
                instancia: stage.instancia,
                status: stage.status,
                data_entrada: nowIso,
                data_saida: null
            });
        }
        
        // Finaliza o processo se for concluído ou cancelado
        const isConcluido = (stage.status === "Concluído" || stage.tag_fluxo === "Cancelado" || String(workflowId).includes("Cancelado"));
        if (isConcluido) {
            json.data_fim_processo = nowIso;
            if (json.historico_tramitacao.length > 0) {
                json.historico_tramitacao[json.historico_tramitacao.length - 1].data_saida = nowIso;
            }
        } else {
            json.data_fim_processo = null;
        }
        // --- FIM DA LÓGICA DE KPI ---

        // Flag permanente de tramitação: "Devolvido" é irreversível.
        // Uma vez que o processo seja devolvido, o flag NÃO retorna para "Normal"
        // mesmo após retomar a tramitação normal.
        const isDevolution     = stage.tag_fluxo === "Devolvido";
        const previouslyDevolv = json.tag_fluxo   === "Devolvido";
        const newTagFluxo      = customTagFluxo || (isDevolution || previouslyDevolv ? "Devolvido" : stage.tag_fluxo);
        if (stage.id_workflow) json.id_workflow = stage.id_workflow;
        json.tag_fluxo   = newTagFluxo;
        json.status = stage.status;
        json.instancia = stage.instancia;
        json.perfil = customPerfil || stage.perfil;
        if (stage.descricao) json.descricao = stage.descricao;

        // Retrocompatibilidade temporária
        json.checkpoint   = stage.status;
        json.status_geral = newTagFluxo;
        
        if (existe) {
            // Atualiza
            const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo?numero_requerimento=eq.${encodeURIComponent(processId)}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dados_json: json })
            });
            if (!patchRes.ok) throw new Error('Erro no PATCH de tabela_status_fluxo: ' + await patchRes.text());
        } else {
            // Cria
            const postRes = await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    numero_requerimento: processId, 
                    dados_json: json 
                })
            });
            if (!postRes.ok) throw new Error('Erro no POST de tabela_status_fluxo: ' + await postRes.text());
        }
        console.log(`Status atualizado para ${json.instancia} - ${json.status_geral}`);
    } catch (e) {
        console.error("Erro ao atualizar status do fluxo:", e);
    }
};

// Expée a funééo global para atualizar dados a partir de iframes
window.updateField = function(name, value) {
    window.formDataState[name] = value;
    triggerSaveDraft();
};

// Expée a funééo para atualizar méltiplos campos de uma vez
window.updateMultipleFields = function(fieldsObj) {
    Object.assign(window.formDataState, fieldsObj);
    triggerSaveDraft();
};

// =========================================================================
// OPERAééES DE BANCO DE DADOS (RELATéRIOS / REPORTS)
// =========================================================================

// Salva o relatério consolidado de um perfil no Supabase
window.saveReportToDB = async function(perfilValue, reportHtml) {
    if (!window.supabaseClient) {
        console.warn("é Supabase não configurado. Relatério salvo temporariamente na sesséo.");
        window.sessionStorage.setItem('foco_report_' + perfilValue, reportHtml);
        return;
    }
    try {
        const { error } = await window.supabaseClient
            .from('foco_reports')
            .upsert({
                perfil_value: PROCESS_ID + '_' + perfilValue,
                report_html: reportHtml,
                updated_at: new Date().toISOString()
            }, { onConflict: 'perfil_value' });

        if (error) {
            console.error(`Erro ao salvar relatério ${perfilValue} no Supabase:`, error);
        } else {
            console.log(`Relatério de ${perfilValue} salvo com sucesso no Supabase.`);
        }
    } catch (err) {
        console.error('Erro inesperado ao salvar relatério:', err);
    }
};

// Busca o relatério consolidado de um perfil
window.loadReportFromDB = async function(perfilValue) {
    if (!window.supabaseClient) {
        return window.sessionStorage.getItem('foco_report_' + perfilValue);
    }
    try {
        const { data, error } = await window.supabaseClient
            .from('foco_reports')
            .select('report_html')
            .eq('perfil_value', PROCESS_ID + '_' + perfilValue)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') {
                console.error(`Erro ao carregar relatério ${perfilValue}:`, error);
            }
            return null;
        }
        return data ? data.report_html : null;
    } catch (err) {
        console.error('Erro inesperado ao carregar relatério:', err);
        return null;
    }
};

// =========================================================================
// OPERAééES DE BANCO DE DADOS (CONFIGURAééES DE PERFIS)
// =========================================================================

window.saveConfigRoles = async function(rolesData) {
    if (!window.supabaseClient) {
        console.warn("é Supabase não configurado. Salvando perfis localmente.");
        window.localStorage.setItem('spunet_roles', JSON.stringify(rolesData));
        return true;
    }
    try {
        // Verifica se existe
        const { data, error: fetchErr } = await window.supabaseClient
            .from('foco_drafts')
            .select('process_id')
            .eq('process_id', 'GLOBAL_CONFIG_ROLES')
            .single();

        if (fetchErr && fetchErr.code === 'PGRST116') {
            // Não existe, insere
            const { error: insErr } = await window.supabaseClient
                .from('foco_drafts')
                .insert([{
                    process_id: 'GLOBAL_CONFIG_ROLES',
                    form_data: rolesData,
                    updated_at: new Date().toISOString()
                }]);
            if (insErr) throw insErr;
        } else if (!fetchErr) {
            // Existe, atualiza
            const { error: updErr } = await window.supabaseClient
                .from('foco_drafts')
                .update({
                    form_data: rolesData,
                    updated_at: new Date().toISOString()
                })
                .eq('process_id', 'GLOBAL_CONFIG_ROLES');
            if (updErr) throw updErr;
        } else {
            throw fetchErr;
        }
        return true;
    } catch (err) {
        console.error('Erro ao salvar configuraéées de perfis no Supabase:', err);
        return false;
    }
};

window.loadConfigRoles = async function() {
    if (!window.supabaseClient) {
        const local = window.localStorage.getItem('spunet_roles');
        return local ? JSON.parse(local) : {};
    }
    try {
        const { data, error } = await window.supabaseClient
            .from('foco_drafts')
            .select('form_data')
            .eq('process_id', 'GLOBAL_CONFIG_ROLES')
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data ? data.form_data : {};
    } catch (err) {
        console.error('Erro ao carregar configuraéées de perfis:', err);
        return {};
    }
};

// =========================================================================
// POPULAR O BANCO COM 20 EXEMPLOS (SEEDING)
// =========================================================================
window.seedDatabase = async function() {
    if (!window.supabaseClient) return false;

    // Helper to complete RIP data structures in mock data
    function completeMockRIPs(form_data) {
        if (!form_data._ripsPesquisados) return;
        for (let rip in form_data._ripsPesquisados) {
            const r = form_data._ripsPesquisados[rip];
            r.rip = r.rip || rip;
            r.descricao = r.descricao || form_data.denominacao || "Imóvel Patrimonial SPU";
            r.municipio = r.municipio || form_data.municipio || "Brasélia/DF";
            r.uf = r.uf || form_data.uf || r.municipio.split('/')[1] || "DF";
            r.origem = r.origem || form_data.origem || "Portal de Serviços";
            r.cep = r.cep || (form_data.uf === "SE" ? "49001-000" : form_data.uf === "SP" ? "01001-000" : "70040-010");
            r.area_total = r.area_total || form_data.area || "1.200,00";
            r.valor_imovel = r.valor_imovel || form_data.valor || "500.000,00";
            r.logradouro = r.logradouro || "Endereço do Imóvel SPU, s/n";
            r.natureza = r.natureza || "Urbano";
            r.tipoImóvel = r.tipoImóvel || form_data.categoria || "Gleba/Terreno/Lote com edificaééo";
        }
    }

    try {
window.mockProcesses = [
            {
                process_id: "2494",
                form_data: {
                    status: "Devolvido para complementação", uf: "SE", municipio: "ARACAJU/SE",
                    denominacao: "Rancho Menezes, Gleba Itat", area: "840.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    tipo_procedimento: "TAUS", status_flow: "SPU/UF",
                    origem: "Datalake", campo11: "DF04594/2026", campo12: "10/05/2026",
                    campo13: "10480.002494/2026-11", campo14: "00.123.456/0001-99", campo15: "Associação de Moradores Itat",
                    _ripsPesquisados: {
                        "78945612": { rip: "78945612", descricao: "Rancho Menezes, Gleba Itaté A", municipio: "ARACAJU/SE", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        },
                        "78945613": { rip: "78945613", descricao: "Rancho Menezes, Gleba Itaté B", municipio: "ARACAJU/SE", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2493",
                form_data: {
                    status: "Aguardando análise", uf: "PA", municipio: "TUCURUé/PA",
                    nup: "10154.654321/2026-22", interessado: "Maria de Lourdes (Idosa)", prioridade_legal: "Sim (Estatuto do Idoso)",
                    denominacao: "Rio Tocantins - UHE DE TUCURUI", area: "12500.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "Não informado",
                    tipo_procedimento: "Cessão de Uso", status_flow: "SPU/UF",
                    origem: "Portal de Serviços", campo11: "DF04593/2026", campo12: "12/05/2026",
                    campo13: "10154.654321/2026-22", campo14: "00.654.321/0001-88", campo15: "Maria de Lourdes (Idosa)",
                    _ripsPesquisados: {
                        "45612378": { rip: "45612378", descricao: "Rio Tocantins - Margem Esquerda", municipio: "TUCURUé/PA", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2437",
                form_data: {
                    status: "Viabilidade confirmada", uf: "SE", municipio: "ARACAJU/SE",
                    denominacao: "ACT Reurb Bairros Centro, Fétima, Pema e Beira Mar", area: "603.62", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    tipo_procedimento: "Doação com Encargo", status_flow: "Encaminhar é Destinação",
                    origem: "Cadastro SPUnet", campo11: "DF04437/2026", campo12: "01/04/2026",
                    campo13: "10480.002437/2026-99", campo14: "13.054.437/0001-00", campo15: "Município de Aracaju",
                    _ripsPesquisados: {
                        "12345678": { rip: "12345678", descricao: "ACT Reurb Centro", municipio: "ARACAJU/SE", origem: "Cadastro SPUnet",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2492",
                form_data: {
                    status: "Em análise", uf: "RS", municipio: "PELOTAS/RS",
                    denominacao: "Pelotas, Salgado Filho, 902", area: "20000.00", categoria: "Terreno",
                    linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Proviséo habitacional",
                    tipo_procedimento: "Doação com Encargo", status_flow: "CDE",
                    origem: "Datalake", campo11: "DF04592/2026", campo12: "14/05/2026",
                    campo13: "10480.002492/2026-44", campo14: "20.123.902/0001-11", campo15: "Cooperativa Pelotense Casa Prépria",
                    _ripsPesquisados: {
                        "98765432": { rip: "98765432", descricao: "Pelotas Salgado Filho 902", municipio: "PELOTAS/RS", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2453",
                form_data: {
                    status: "Aguardando análise", uf: "PR", municipio: "CAMPO MOURéO/PR",
                    denominacao: "Unidade da Secretaria Municipal de Saéde daquele Município", area: "1900.00", categoria: "Casa",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    tipo_procedimento: "Cessão de Uso", status_flow: "SPU/UF",
                    origem: "Portal de Serviços", campo11: "DF04453/2026", campo12: "20/04/2026",
                    campo13: "10480.002453/2026-55", campo14: "75.123.456/0001-33", campo15: "Prefeitura Municipal de Campo Mouréo",
                    _ripsPesquisados: {
                        "85296374": { rip: "85296374", descricao: "Unidade Municipal Saéde", municipio: "CAMPO MOURéO/PR", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2401",
                form_data: {
                    status: "Viabilidade confirmada", uf: "DF", municipio: "BRASÍLIA/DF",
                    denominacao: "Gleba de Terra - Park Way Qd 5", area: "5000.00", categoria: "Terreno",
                    linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Proviséo habitacional",
                    tipo_procedimento: "Venda Direta", status_flow: "Encaminhar é Destinação",
                    origem: "Cadastro SPUnet", campo11: "DF04401/2026", campo12: "05/01/2026",
                    campo13: "10480.002401/2026-66", campo14: "12.345.678/0001-90", campo15: "Codhab DF",
                    _ripsPesquisados: {
                        "11112222": { rip: "11112222", descricao: "Gleba Park Way Qd 5", municipio: "BRASÍLIA/DF", origem: "Cadastro SPUnet",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2402",
                form_data: {
                    status: "Em análise", uf: "SP", municipio: "SéO PAULO/SP",
                    denominacao: "Edifécio Centro Histérico SPU", area: "1200.50", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    tipo_procedimento: "Cessão de Uso", status_flow: "Direção",
                    origem: "Portal de Serviços", campo11: "DF04402/2026", campo12: "10/01/2026",
                    campo13: "10480.002402/2026-77", campo14: "00.321.654/0002-12", campo15: "Gabinete Presidencial Regional",
                    _ripsPesquisados: {
                        "22223333": { rip: "22223333", descricao: "Prédio Histérico Centro", municipio: "SéO PAULO/SP", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2403",
                form_data: {
                    status: "Aguardando análise", uf: "RJ", municipio: "RIO DE JANEIRO/RJ",
                    denominacao: "Área Adjacente Porto Maravilha", area: "8500.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    tipo_procedimento: "Transferência de Gestão", status_flow: "SPU/UF",
                    origem: "Datalake", campo11: "DF04403/2026", campo12: "15/01/2026",
                    campo14: "42.345.678/0001-90", campo15: "CDURP - Regiéo Portuária do Rio de Janeiro",
                    _ripsPesquisados: {
                        "33334444": { rip: "33334444", descricao: "Porto Maravilha Gleba A", municipio: "RIO DE JANEIRO/RJ", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        },
                        "33334445": { rip: "33334445", descricao: "Porto Maravilha Gleba B", municipio: "RIO DE JANEIRO/RJ", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2404",
                form_data: {
                    status: "Viabilidade confirmada", uf: "BA", municipio: "SALVADOR/BA",
                    denominacao: "Terreno Marinha - Bairro Comércio", area: "3100.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    tipo_procedimento: "TAUS", status_flow: "Encaminhar é Destinação",
                    origem: "Cadastro SPUnet", campo11: "DF04404/2026", campo12: "20/01/2026",
                    campo14: "13.456.789/0001-02", campo15: "Secretaria de Desenvolvimento Urbano da Bahia - SEDUR",
                    _ripsPesquisados: {
                        "44445555": { rip: "44445555", descricao: "Terreno Marinha Comércio", municipio: "SALVADOR/BA", origem: "Cadastro SPUnet",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2405",
                form_data: {
                    status: "Em análise", uf: "MG", municipio: "BELO HORIZONTE/MG",
                    denominacao: "Antiga Estação Ferroviária Leste", area: "15000.00", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "24.4 Equipamento comunitário/cultural",
                    tipo_procedimento: "Cessão de Uso", status_flow: "Direção",
                    origem: "Portal de Serviços", campo11: "DF04405/2026", campo12: "25/01/2026",
                    campo14: "00.375.442/0001-20", campo15: "Instituto Cultural Memorial de Minas Gerais",
                    _ripsPesquisados: {
                        "55556666": { rip: "55556666", descricao: "Estação Ferroviária Leste", municipio: "BELO HORIZONTE/MG", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2406",
                form_data: {
                    status: "Aguardando análise", uf: "SE", municipio: "ESTÂNCIA/SE",
                    denominacao: "Gleba Praia do Saco", area: "45000.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "14.1 Ecoturismo/Lazer",
                    tipo_procedimento: "Permuta", status_flow: "SPU/UF",
                    origem: "Datalake", campo11: "DF04406/2026", campo12: "01/02/2026",
                    campo14: "13.113.882/0001-44", campo15: "Associação de Ecoturismo da Praia do Saco"
                }
            },
            {
                process_id: "2407",
                form_data: {
                    status: "Em análise", uf: "RS", municipio: "PORTO ALEGRE/RS",
                    denominacao: "Galpão Docas do Cais do Porto", area: "6200.00", categoria: "Galpão",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "3.1 Unidade de atendimento",
                    tipo_procedimento: "Transferência de Gestão", status_flow: "CDE",
                    origem: "Portal de Serviços", campo11: "DF04407/2026", campo12: "05/02/2026",
                    campo14: "92.758.123/0001-50", campo15: "Superintendência Portuária do Rio Grande do Sul",
                    _ripsPesquisados: {
                        "77778888": { rip: "77778888", descricao: "Galpão Docas Cais Porto", municipio: "PORTO ALEGRE/RS", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2408",
                form_data: {
                    status: "Aguardando análise", uf: "PR", municipio: "CURITIBA/PR",
                    denominacao: "Terreno Bacacheri SPU", area: "890.00", categoria: "Terreno",
                    linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Proviséo habitacional",
                    tipo_procedimento: "Doação com Encargo", status_flow: "SPU/UF",
                    origem: "Cadastro SPUnet", campo11: "DF04408/2026", campo12: "10/02/2026",
                    campo14: "76.102.345/0001-06", campo15: "Companhia de Habitação Popular de Curitiba - COHAB",
                    _ripsPesquisados: {
                        "88889999": { rip: "88889999", descricao: "Terreno Bacacheri", municipio: "CURITIBA/PR", origem: "Cadastro SPUnet",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2409",
                form_data: {
                    status: "Viabilidade confirmada", uf: "SP", municipio: "SANTOS/SP",
                    denominacao: "Área Retroportuéria Sabo", area: "35000.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "12.1 Logística/Transportes",
                    tipo_procedimento: "Cessão de Uso", status_flow: "Encaminhar é Destinação",
                    origem: "Datalake", campo11: "DF04409/2026", campo12: "15/02/2026",
                    campo14: "44.852.963/0001-11", campo15: "Autoridade Portuária de Santos - APS",
                    _ripsPesquisados: {
                        "99990000": { rip: "99990000", descricao: "Área Retroportuéria Sabo", municipio: "SANTOS/SP", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2410",
                form_data: {
                    status: "Em análise", uf: "RJ", municipio: "NITERÓI/RJ",
                    denominacao: "Forte Gragoatá Gleba SPU", area: "12000.00", categoria: "Outros",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "24.4 Equipamento comunitário/cultural",
                    tipo_procedimento: "Transferência de Gestão", status_flow: "Direção",
                    origem: "Portal de Serviços", campo11: "DF04410/2026", campo12: "20/02/2026",
                    campo14: "28.521.902/0001-80", campo15: "Universidade Federal Fluminense - UFF",
                    _ripsPesquisados: {
                        "10101010": { rip: "10101010", descricao: "Forte Gragoatá Gleba", municipio: "NITERÓI/RJ", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2411",
                form_data: {
                    status: "Viabilidade confirmada", uf: "DF", municipio: "SOBRADINHO/DF",
                    denominacao: "Gleba Reurb Setor de Chácaras", area: "75000.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    tipo_procedimento: "Doação com Encargo", status_flow: "Encaminhar é Destinação",
                    origem: "Cadastro SPUnet", campo11: "DF04411/2026", campo12: "22/02/2026",
                    campo14: "12.345.678/0001-90", campo15: "CODHAB - Companhia de Desenvolvimento Habitacional do DF",
                    _ripsPesquisados: {
                        "20202020": { rip: "20202020", descricao: "Gleba Reurb Setor Chácaras", municipio: "SOBRADINHO/DF", origem: "Cadastro SPUnet",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2412",
                form_data: {
                    status: "Aguardando análise", uf: "BA", municipio: "FEIRA DE SANTANA/BA",
                    denominacao: "Prédio Antigo INSS SPU", area: "2400.00", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    tipo_procedimento: "Cessão de Uso", status_flow: "SPU/UF",
                    origem: "Portal de Serviços", campo11: "DF04412/2026", campo12: "25/02/2026",
                    campo14: "29.979.036/0001-40", campo15: "Instituto Nacional do Seguro Social - INSS"
                }
            },
            {
                process_id: "2413",
                form_data: {
                    status: "Em análise", uf: "MG", municipio: "JUIZ DE FORA/MG",
                    denominacao: "Gleba Industrial SPU Juiz de Fora", area: "18500.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "12.2 Indústria/Comércio",
                    tipo_procedimento: "Venda Direta", status_flow: "Direção",
                    origem: "Datalake", campo11: "DF04413/2026", campo12: "01/03/2026",
                    campo14: "18.324.900/0001-55", campo15: "Prefeitura Municipal de Juiz de Fora",
                    _ripsPesquisados: {
                        "40404040": { rip: "40404040", descricao: "Gleba Industrial Juiz de Fora", municipio: "JUIZ DE FORA/MG", origem: "Datalake",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2414",
                form_data: {
                    status: "Aguardando análise", uf: "SE", municipio: "PROPRIÁ/SE",
                    denominacao: "Gleba Margem Rio Séo Francisco", area: "900.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    tipo_procedimento: "TAUS", status_flow: "SPU/UF",
                    origem: "Cadastro SPUnet", campo11: "DF04414/2026", campo12: "05/03/2026",
                    campo14: "00.325.904/0001-77", campo15: "CODEVASF - Regional Sergipe",
                    _ripsPesquisados: {
                        "50505050": { rip: "50505050", descricao: "Gleba Margem Rio S. Francisco", municipio: "PROPRIÁ/SE", origem: "Cadastro SPUnet",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            },
            {
                process_id: "2415",
                form_data: {
                    status: "Viabilidade confirmada", uf: "DF", municipio: "BRASÍLIA/DF",
                    denominacao: "Sede SPU Bloco C Esplanada", area: "14500.00", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    tipo_procedimento: "Cessão de Uso", status_flow: "Encaminhar é Destinação",
                    origem: "Portal de Serviços", campo11: "DF04415/2026", campo12: "10/03/2026",
                    campo14: "00.489.828/0001-33", campo15: "Ministério da Gestão e da Inovação em Serviços Públicos - MGI",
                    _ripsPesquisados: {
                        "60606060": { rip: "60606060", descricao: "Sede SPU Bloco C", municipio: "BRASÍLIA/DF", origem: "Portal de Serviços",
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImóvel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
            endereco: 'Endereço Simulado, s/n',
            area_total: '5000.00',
            area_uniao: '5000.00',
            area_construída_total: '2.400,00',
            area_terreno_disponivel: '2.400,00',
            area_construída_disponivel: '2.400,00',
            valor_avaliado: '500.000,00',
            data_avaliação: '13/05/2026',
            instrumento_avaliação: 'Laudo Técnico SPU',

            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '1234.56790/2026-00',
            matricula: '123.456 - 1º CRI SP'
        }
                    }
                }
            }
        ];

        for (let proc of mockProcesses) {
            // Garante que todo processo tem processo SEI (campo13)
            proc.form_data.campo13 = proc.form_data.campo13 || `10480.00${proc.process_id}/2026-${proc.process_id.substring(proc.process_id.length - 2)}`;
            // Garante dados completos nos Rips
            completeMockRIPs(proc.form_data);

            // Garante dados fictícios da proposta de destinação (Aba 6)
            const rips = proc.form_data._ripsPesquisados;
            let areaTotalStr = "1.200,00";
            let valorTotalStr = "500.000,00";
            
            if (rips && Object.keys(rips).length > 0) {
                const firstRip = rips[Object.keys(rips)[0]];
                areaTotalStr = firstRip.area_total || "1.200,00";
                valorTotalStr = firstRip.valor_imovel || "500.000,00";
            } else if (proc.form_data.area) {
                areaTotalStr = parseFloat(proc.form_data.area).toFixed(2).replace('.', ',');
            }
            
            proc.form_data.area_total_imovel = proc.form_data.area_total_imovel || areaTotalStr;
            proc.form_data.valor_total_imovel = proc.form_data.valor_total_imovel || valorTotalStr;
            
            // Valores fictícios proporcionais para a Área destinada
            const areaNum = parseFloat(proc.form_data.area_total_imovel.replace(/\./g, '').replace(',', '.')) || 1200;
            const valorNum = parseFloat(proc.form_data.valor_total_imovel.replace(/\./g, '').replace(',', '.')) || 500000;
            
            const areaDestTerreno = (areaNum * 0.75).toFixed(2).replace('.', ',');
            const areaDestConstruida = (areaNum * 0.50).toFixed(2).replace('.', ',');
            const valorDest = (valorNum * 0.72).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            proc.form_data.area_terreno_destinada = proc.form_data.area_terreno_destinada || areaDestTerreno;
            proc.form_data.area_construída_destinada = proc.form_data.area_construída_destinada || areaDestConstruida;
            proc.form_data.valor_area_destinada = proc.form_data.valor_area_destinada || valorDest;

            const { error } = await window.supabaseClient
                .from('foco_drafts')
                .upsert({
                    process_id: proc.process_id,
                    form_data: proc.form_data,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'process_id' });

            if (error) {
                console.error(`Erro ao seedar processo ${proc.process_id}:`, error);
                return false;
            }
        }
        console.log("<1 Banco de dados populado com 20 processos simulados com sucesso.");
        return true;
    } catch (err) {
        console.error("Erro inesperado no seeding:", err);
        return false;
    }
};

// SALVA NA TABELA DEFINITIVA (foco_final)
window.saveToFinal = async function() {
    console.log("=é Salvando na tabela DEFINITIVA (foco_final)...", window.formDataState);
    if (!window.formDataState) return false;

    // Remove campos indesejados
    const dataToSave = { ...window.formDataState };
    delete dataToSave.undefined;
    
    // Atualiza status local
    dataToSave.status = dataToSave.status || "Normal";

    try {
        const url = `${SUPABASE_URL}/rest/v1/foco_final?on_conflict=process_id`;
        const body = {
            process_id: PROCESS_ID,
            form_data: dataToSave,
            updated_at: new Date().toISOString()
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error("L Erro ao salvar na tabela definitiva:", await res.text());
            return false;
        }

        console.log(" Salvo com sucesso na tabela definitiva!");
        
        // Dispara evento para feedback visual, se necessário
        const iframe = document.getElementById('frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'SAVED_TO_FINAL' }, '*');
        }
        
        return true;
    } catch (err) {
        console.error("L Erro na requisição (saveToFinal):", err);
        return false;
    }
};

window.salvarIndicacaoItem = async (processId, tipo, dados) => {
    if (!processId) {
        console.error("Sem PROCESS_ID, impossível salvar na tabela_indicacao.");
        return;
    }
    
    // Primeiro, tenta carregar o registro atual
    let registro = await window.carregarIndicacoes(processId);
    let dadosJson = registro ? registro.dados_json : { rips: [], cadastros_minimos: [] };
    
    if (tipo === 'RIP') {
        if (!dadosJson.rips) dadosJson.rips = [];
        if (!dadosJson.rips.includes(dados)) dadosJson.rips.push(dados);
    } else if (tipo === 'CADASTRO_MINIMO') {
        if (!dadosJson.cadastros_minimos) dadosJson.cadastros_minimos = [];
        dadosJson.cadastros_minimos.push(dados);
    }
    
    const body = {
        numero_requerimento: processId,
        dados_json: dadosJson
    };
    
    try {
        const url = `${window.SUPABASE_URL}/rest/v1/tabela_indicacao?on_conflict=numero_requerimento`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': window.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) console.error("Erro ao salvar indicação", await res.text());
        else console.log("Indicação salva com sucesso!");
    } catch (e) {
        console.error("Erro na requisição salvarIndicacaoItem", e);
    }
};

window.carregarIndicacoes = async (processId) => {
    if (!processId) return null;
    try {
        const url = `${window.SUPABASE_URL}/rest/v1/tabela_indicacao?select=*&numero_requerimento=eq.${processId}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': window.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) return data[0];
        }
    } catch (e) {
        console.error("Erro ao carregar indicações", e);
    }
    return null;
};

// Snapshot Histórico JSON
window.salvarSnapshotHistorico = async (abaOrigem) => {
    const processId = new URLSearchParams(window.location.search).get('processo');
    if (!processId || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;
    
    // Obter o estado atual dos dados para bater a foto exata (Snapshot)
    const dadosSnapshot = JSON.parse(JSON.stringify(window.formDataState));

    const payload = {
        processo_id: processId,
        aba_origem: abaOrigem,
        dados_snapshot: dadosSnapshot
    };

    try {
        const url = `${window.SUPABASE_URL}/rest/v1/foco_historico`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': window.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`Erro ao salvar snapshot histórico da ${abaOrigem}:`, await res.text());
        } else {
            console.log(`Snapshot histórico da ${abaOrigem} salvo com sucesso no Supabase!`);
        }
    } catch (e) {
        console.error("Erro na requisição salvarSnapshotHistorico:", e);
    }
};

// Executa no carregamento inicial da página
document.addEventListener('DOMContentLoaded', async () => {
    await loadDraftFromDB();
    if (typeof window.verificarDevolucaoSupabase === 'function') {
        await window.verificarDevolucaoSupabase();
    }
});

// Verifica se há alguma devolução pendente para exibir no banner
window.verificarDevolucaoSupabase = async function(doc = document) {
    let processId = new URLSearchParams(window.location.search).get('processo');
    if (!processId) processId = localStorage.getItem('CURRENT_PROCESS_ID');
    if (!processId && window.parent) processId = new URLSearchParams(window.parent.location.search).get('processo');

    const supabaseUrl = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
    const supabaseKey = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);

    if (!processId || !supabaseUrl || !supabaseKey) return;

    try {
        const url = `${supabaseUrl}/rest/v1/tabela_deliberacoes?process_id=eq.${processId}&order=created_at.desc&limit=1`;
        const res = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
                const ultima = data[0].dados_deliberacao;
                
                // Se a última ação foi devolver/complementar
                if (ultima.decisao === 'devolver' || ultima.decisao === 'complementacao') {
                    if (ultima.destino) {
                        const numAba = ultima.destino.replace('aba', '');
                        const bannerId = `bannerDevolucaoAba${numAba}`;
                        const textoId = `textoMotivoDevolucaoAba${numAba}`;
                        
                        const bannerEl = doc.getElementById(bannerId);
                        const textoEl = doc.getElementById(textoId);
                        
                        // Exibe apenas se o elemento da aba correspondente existir na página atual
                        if (bannerEl && textoEl) {
                            textoEl.textContent = ultima.motivo || "Motivo não informado pela chefia.";
                            bannerEl.style.display = 'block';
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error("Erro ao verificar devoluções:", e);
    }
};


// Mock arrays removed.
