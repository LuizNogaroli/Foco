// db.js
// Controlador central de estado e conexão com o Supabase (PostgreSQL)
// Este arquivo é carregado pelo index.html e expõe funções globais para os iframes.

// =========================================================================
// ATENÇÃO: COLE SUAS CHAVES DO SUPABASE ABAIXO
// =========================================================================
const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

window.supabaseClient = null;
window.formDataState = {};
window.isSaving = false;

// Inicializa o cliente do Supabase se o SDK foi carregado via CDN
if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    if (SUPABASE_URL !== "SUA_URL_DO_SUPABASE" && SUPABASE_ANON_KEY !== "SUA_CHAVE_ANON_DO_SUPABASE") {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ Cliente Supabase inicializado com sucesso.");
    } else {
        console.warn("⚠️ URL ou Chave Anon do Supabase não configuradas no db.js. O sistema funcionará apenas em memória temporária.");
    }
} else {
    console.error("❌ SDK do Supabase não foi carregado. Verifique a importação no index.html.");
}

// Identificador exclusivo do rascunho de simulação (útil para multi-usuários futuramente)
const PROCESS_ID = 'processo-admissibilidade-foco';

// =========================================================================
// OPERAÇÕES DE BANCO DE DADOS (RASCUNHOS / DRAFTS)
// =========================================================================

// Carrega os dados salvos do banco de dados no carregamento inicial da página
async function loadDraftFromDB() {
    if (!window.supabaseClient) return;
    try {
        const { data, error } = await window.supabaseClient
            .from('foco_drafts')
            .select('form_data')
            .eq('process_id', PROCESS_ID)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 indica que o registro não existe ainda
            console.error('Erro ao carregar rascunho do Supabase:', error);
            return;
        }

        if (data && data.form_data) {
            window.formDataState = data.form_data;
            console.log('Rascunho recuperado com sucesso do Supabase:', window.formDataState);
            
            // Dispara um evento para notificar o iframe ativo sobre o carregamento dos dados
            const iframe = document.getElementById('frame');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'DATABASE_LOADED', data: window.formDataState }, '*');
            }
        }
    } catch (err) {
        console.error('Erro inesperado ao carregar rascunho:', err);
    }
}

// Função com debounce de 1 segundo para evitar chamadas excessivas de rede
let saveTimeout = null;
function triggerSaveDraft() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        if (!window.supabaseClient) return;
        window.isSaving = true;
        try {
            const { error } = await window.supabaseClient
                .from('foco_drafts')
                .upsert({
                    process_id: PROCESS_ID,
                    form_data: window.formDataState,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'process_id' });

            if (error) {
                console.error('Erro ao salvar rascunho no Supabase:', error);
            } else {
                console.log('Rascunho auto-salvo no Supabase.');
            }
        } catch (err) {
            console.error('Erro inesperado ao salvar rascunho:', err);
        } finally {
            window.isSaving = false;
        }
    }, 1000);
}

// Expõe a função global para atualizar dados a partir de iframes
window.updateField = function(name, value) {
    window.formDataState[name] = value;
    triggerSaveDraft();
};

// Expõe a função para atualizar múltiplos campos de uma vez
window.updateMultipleFields = function(fieldsObj) {
    Object.assign(window.formDataState, fieldsObj);
    triggerSaveDraft();
};

// =========================================================================
// OPERAÇÕES DE BANCO DE DADOS (RELATÓRIOS / REPORTS)
// =========================================================================

// Salva o relatório consolidado de um perfil no Supabase
window.saveReportToDB = async function(perfilValue, reportHtml) {
    if (!window.supabaseClient) {
        console.warn("⚠️ Supabase não configurado. Relatório salvo temporariamente na sessão.");
        window.sessionStorage.setItem('foco_report_' + perfilValue, reportHtml);
        return;
    }
    try {
        const { error } = await window.supabaseClient
            .from('foco_reports')
            .upsert({
                perfil_value: perfilValue,
                report_html: reportHtml,
                updated_at: new Date().toISOString()
            }, { onConflict: 'perfil_value' });

        if (error) {
            console.error(`Erro ao salvar relatório ${perfilValue} no Supabase:`, error);
        } else {
            console.log(`Relatório de ${perfilValue} salvo com sucesso no Supabase.`);
        }
    } catch (err) {
        console.error('Erro inesperado ao salvar relatório:', err);
    }
};

// Busca o relatório consolidado de um perfil
window.loadReportFromDB = async function(perfilValue) {
    if (!window.supabaseClient) {
        return window.sessionStorage.getItem('foco_report_' + perfilValue);
    }
    try {
        const { data, error } = await window.supabaseClient
            .from('foco_reports')
            .select('report_html')
            .eq('perfil_value', perfilValue)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') {
                console.error(`Erro ao carregar relatório ${perfilValue}:`, error);
            }
            return null;
        }
        return data ? data.report_html : null;
    } catch (err) {
        console.error('Erro inesperado ao carregar relatório:', err);
        return null;
    }
};

// Executa no carregamento inicial da página
document.addEventListener('DOMContentLoaded', async () => {
    await loadDraftFromDB();
});
