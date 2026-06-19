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

// Identificador exclusivo do rascunho de simulação lido dinamicamente da URL
const urlParams = new URLSearchParams(window.location.search);
const PROCESS_ID = urlParams.get('process_id') || 'processo-admissibilidade-foco';

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
                perfil_value: PROCESS_ID + '_' + perfilValue,
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
            .eq('perfil_value', PROCESS_ID + '_' + perfilValue)
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

// =========================================================================
// POPULAR O BANCO COM 20 EXEMPLOS (SEEDING)
// =========================================================================
window.seedDatabase = async function() {
    if (!window.supabaseClient) return false;
    try {
        const mockProcesses = [
            {
                process_id: "2494",
                form_data: {
                    status: "RASCUNHO", uf: "SE", municipio: "ARACAJU/SE",
                    denominacao: "Rancho Menezes, Gleba Itatá", area: "840.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    origem: "Datalake", campo11: "DF04594/2026", campo12: "10/05/2026",
                    campo13: "10480.002494/2026-11", campo14: "00.123.456/0001-99", campo15: "Associação de Moradores Itatá",
                    _ripsPesquisados: {
                        "78945612": { rip: "78945612", descricao: "Rancho Menezes, Gleba Itatá", municipio: "ARACAJU/SE", origem: "Datalake" }
                    }
                }
            },
            {
                process_id: "2493",
                form_data: {
                    status: "RASCUNHO", uf: "PA", municipio: "TUCURUÍ/PA",
                    denominacao: "Rio Tocantins - UHE DE TUCURUI", area: "12500.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "Não informado",
                    origem: "Portal de Serviços", campo11: "DF04593/2026", campo12: "12/05/2026",
                    campo13: "10480.002493/2026-22", campo14: "00.654.321/0001-88", campo15: "Centrais Elétricas do Norte",
                    _ripsPesquisados: {
                        "45612378": { rip: "45612378", descricao: "Rio Tocantins - Margem Esquerda", municipio: "TUCURUÍ/PA", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2437",
                form_data: {
                    status: "DESTINADO", uf: "SE", municipio: "ARACAJU/SE",
                    denominacao: "ACT Reurb Bairros Centro, Fátima, Pema e Beira Mar", area: "603.62", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    origem: "Cadastro SPUnet", campo11: "DF04437/2026", campo12: "01/04/2026",
                    campo13: "10480.002437/2026-99", campo14: "13.054.437/0001-00", campo15: "Município de Aracaju",
                    _ripsPesquisados: {
                        "12345678": { rip: "12345678", descricao: "ACT Reurb Centro", municipio: "ARACAJU/SE", origem: "Cadastro SPUnet" }
                    }
                }
            },
            {
                process_id: "2492",
                form_data: {
                    status: "CADASTRADO", uf: "RS", municipio: "PELOTAS/RS",
                    denominacao: "Pelotas, Salgado Filho, 902", area: "20000.00", categoria: "Terreno",
                    linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Provisão habitacional",
                    origem: "Datalake", campo11: "DF04592/2026", campo12: "14/05/2026",
                    campo13: "10480.002492/2026-44", campo14: "20.123.902/0001-11", campo15: "Cooperativa Pelotense Casa Própria",
                    _ripsPesquisados: {
                        "98765432": { rip: "98765432", descricao: "Pelotas Salgado Filho 902", municipio: "PELOTAS/RS", origem: "Datalake" }
                    }
                }
            },
            {
                process_id: "2453",
                form_data: {
                    status: "RASCUNHO", uf: "PR", municipio: "CAMPO MOURÃO/PR",
                    denominacao: "Unidade da Secretaria Municipal de Saúde daquele Município", area: "1900.00", categoria: "Casa",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    origem: "Portal de Serviços", campo11: "DF04453/2026", campo12: "20/04/2026",
                    campo13: "10480.002453/2026-55", campo14: "75.123.456/0001-33", campo15: "Prefeitura Municipal de Campo Mourão",
                    _ripsPesquisados: {
                        "85296374": { rip: "85296374", descricao: "Unidade Municipal Saúde", municipio: "CAMPO MOURÃO/PR", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2401",
                form_data: {
                    status: "DESTINADO", uf: "DF", municipio: "BRASÍLIA/DF",
                    denominacao: "Gleba de Terra - Park Way Qd 5", area: "5000.00", categoria: "Terreno",
                    linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Provisão habitacional",
                    origem: "Cadastro SPUnet", campo11: "DF04401/2026", campo12: "05/01/2026",
                    campo13: "10480.002401/2026-66", campo14: "12.345.678/0001-90", campo15: "Codhab DF",
                    _ripsPesquisados: {
                        "11112222": { rip: "11112222", descricao: "Gleba Park Way Qd 5", municipio: "BRASÍLIA/DF", origem: "Cadastro SPUnet" }
                    }
                }
            },
            {
                process_id: "2402",
                form_data: {
                    status: "CADASTRADO", uf: "SP", municipio: "SÃO PAULO/SP",
                    denominacao: "Edifício Centro Histórico SPU", area: "1200.50", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    origem: "Portal de Serviços", campo11: "DF04402/2026", campo12: "10/01/2026",
                    campo13: "10480.002402/2026-77", campo14: "00.321.654/0002-12", campo15: "Gabinete Presidencial Regional",
                    _ripsPesquisados: {
                        "22223333": { rip: "22223333", descricao: "Prédio Histórico Centro", municipio: "SÃO PAULO/SP", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2403",
                form_data: {
                    status: "RASCUNHO", uf: "RJ", municipio: "RIO DE JANEIRO/RJ",
                    denominacao: "Área Adjacente Porto Maravilha", area: "8500.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    origem: "Datalake", campo11: "DF04403/2026", campo12: "15/01/2026",
                    _ripsPesquisados: {
                        "33334444": { rip: "33334444", descricao: "Porto Maravilha Gleba A", municipio: "RIO DE JANEIRO/RJ", origem: "Datalake" }
                    }
                }
            },
            {
                process_id: "2404",
                form_data: {
                    status: "DESTINADO", uf: "BA", municipio: "SALVADOR/BA",
                    denominacao: "Terreno Marinha - Bairro Comércio", area: "3100.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    origem: "Cadastro SPUnet", campo11: "DF04404/2026", campo12: "20/01/2026",
                    _ripsPesquisados: {
                        "44445555": { rip: "44445555", descricao: "Terreno Marinha Comércio", municipio: "SALVADOR/BA", origem: "Cadastro SPUnet" }
                    }
                }
            },
            {
                process_id: "2405",
                form_data: {
                    status: "CADASTRADO", uf: "MG", municipio: "BELO HORIZONTE/MG",
                    denominacao: "Antiga Estação Ferroviária Leste", area: "15000.00", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "24.4 Equipamento comunitário/cultural",
                    origem: "Portal de Serviços", campo11: "DF04405/2026", campo12: "25/01/2026",
                    _ripsPesquisados: {
                        "55556666": { rip: "55556666", descricao: "Estação Ferroviária Leste", municipio: "BELO HORIZONTE/MG", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2406",
                form_data: {
                    status: "RASCUNHO", uf: "SE", municipio: "ESTÂNCIA/SE",
                    denominacao: "Gleba Praia do Saco", area: "45000.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "14.1 Ecoturismo/Lazer",
                    origem: "Datalake", campo11: "DF04406/2026", campo12: "01/02/2026",
                    _ripsPesquisados: {
                        "66667777": { rip: "66667777", descricao: "Gleba Praia do Saco", municipio: "ESTÂNCIA/SE", origem: "Datalake" }
                    }
                }
            },
            {
                process_id: "2407",
                form_data: {
                    status: "CADASTRADO", uf: "RS", municipio: "PORTO ALEGRE/RS",
                    denominacao: "Galpão Docas do Cais do Porto", area: "6200.00", categoria: "Galpão",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "3.1 Unidade de atendimento",
                    origem: "Portal de Serviços", campo11: "DF04407/2026", campo12: "05/02/2026",
                    _ripsPesquisados: {
                        "77778888": { rip: "77778888", descricao: "Galpão Docas Cais Porto", municipio: "PORTO ALEGRE/RS", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2408",
                form_data: {
                    status: "RASCUNHO", uf: "PR", municipio: "CURITIBA/PR",
                    denominacao: "Terreno Bacacheri SPU", area: "890.00", categoria: "Terreno",
                    linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Provisão habitacional",
                    origem: "Cadastro SPUnet", campo11: "DF04408/2026", campo12: "10/02/2026",
                    _ripsPesquisados: {
                        "88889999": { rip: "88889999", descricao: "Terreno Bacacheri", municipio: "CURITIBA/PR", origem: "Cadastro SPUnet" }
                    }
                }
            },
            {
                process_id: "2409",
                form_data: {
                    status: "DESTINADO", uf: "SP", municipio: "SANTOS/SP",
                    denominacao: "Área Retroportuária Saboó", area: "35000.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "12.1 Logística/Transportes",
                    origem: "Datalake", campo11: "DF04409/2026", campo12: "15/02/2026",
                    _ripsPesquisados: {
                        "99990000": { rip: "99990000", descricao: "Área Retroportuária Saboó", municipio: "SANTOS/SP", origem: "Datalake" }
                    }
                }
            },
            {
                process_id: "2410",
                form_data: {
                    status: "CADASTRADO", uf: "RJ", municipio: "NITERÓI/RJ",
                    denominacao: "Forte Gragoatá Gleba SPU", area: "12000.00", categoria: "Outros",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "24.4 Equipamento comunitário/cultural",
                    origem: "Portal de Serviços", campo11: "DF04410/2026", campo12: "20/02/2026",
                    _ripsPesquisados: {
                        "10101010": { rip: "10101010", descricao: "Forte Gragoatá Gleba", municipio: "NITERÓI/RJ", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2411",
                form_data: {
                    status: "DESTINADO", uf: "DF", municipio: "SOBRADINHO/DF",
                    denominacao: "Gleba Reurb Setor de Chácaras", area: "75000.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    origem: "Cadastro SPUnet", campo11: "DF04411/2026", campo12: "22/02/2026",
                    _ripsPesquisados: {
                        "20202020": { rip: "20202020", descricao: "Gleba Reurb Setor Chácaras", municipio: "SOBRADINHO/DF", origem: "Cadastro SPUnet" }
                    }
                }
            },
            {
                process_id: "2412",
                form_data: {
                    status: "RASCUNHO", uf: "BA", municipio: "FEIRA DE SANTANA/BA",
                    denominacao: "Prédio Antigo INSS SPU", area: "2400.00", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    origem: "Portal de Serviços", campo11: "DF04412/2026", campo12: "25/02/2026",
                    _ripsPesquisados: {
                        "30303030": { rip: "30303030", descricao: "Prédio Antigo INSS", municipio: "FEIRA DE SANTANA/BA", origem: "Portal de Serviços" }
                    }
                }
            },
            {
                process_id: "2413",
                form_data: {
                    status: "CADASTRADO", uf: "MG", municipio: "JUIZ DE FORA/MG",
                    denominacao: "Gleba Industrial SPU Juiz de Fora", area: "18500.00", categoria: "Terreno",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "12.2 Indústria/Comércio",
                    origem: "Datalake", campo11: "DF04413/2026", campo12: "01/03/2026",
                    _ripsPesquisados: {
                        "40404040": { rip: "40404040", descricao: "Gleba Industrial Juiz de Fora", municipio: "JUIZ DE FORA/MG", origem: "Datalake" }
                    }
                }
            },
            {
                process_id: "2414",
                form_data: {
                    status: "RASCUNHO", uf: "SE", municipio: "PROPRIÁ/SE",
                    denominacao: "Gleba Margem Rio São Francisco", area: "900.00", categoria: "Terreno",
                    linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
                    origem: "Cadastro SPUnet", campo11: "DF04414/2026", campo12: "05/03/2026",
                    _ripsPesquisados: {
                        "50505050": { rip: "50505050", descricao: "Gleba Margem Rio S. Francisco", municipio: "PROPRIÁ/SE", origem: "Cadastro SPUnet" }
                    }
                }
            },
            {
                process_id: "2415",
                form_data: {
                    status: "DESTINADO", uf: "DF", municipio: "BRASÍLIA/DF",
                    denominacao: "Sede SPU Bloco C Esplanada", area: "14500.00", categoria: "Prédio",
                    linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
                    origem: "Portal de Serviços", campo11: "DF04415/2026", campo12: "10/03/2026",
                    _ripsPesquisados: {
                        "60606060": { rip: "60606060", descricao: "Sede SPU Bloco C", municipio: "BRASÍLIA/DF", origem: "Portal de Serviços" }
                    }
                }
            }
        ];

        for (let proc of mockProcesses) {
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
        console.log("🌱 Banco de dados populado com 20 processos simulados com sucesso.");
        return true;
    } catch (err) {
        console.error("Erro inesperado no seeding:", err);
        return false;
    }
};

// Executa no carregamento inicial da página
document.addEventListener('DOMContentLoaded', async () => {
    await loadDraftFromDB();
});
