const fs = require('fs');

const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

async function updateRIP() {
    console.log("Buscando dados atuais do RIP 2026001...");
    
    // 1. Fetch current data
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/tabela_spu?numero_rip=eq.2026001`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    
    if (!getRes.ok) {
        console.error("Erro ao buscar", await getRes.text());
        return;
    }
    
    const rows = await getRes.json();
    if (rows.length === 0) {
        console.error("RIP 2026001 não encontrado na tabela_spu.");
        return;
    }
    
    const existingRow = rows[0];
    let dados = existingRow.dados_json || {};
    
    console.log("Mergeando os novos dados mock...");
    // 2. Merge mock data
    const mockData = {
        situacao_ocupacional: "Ocupado regularmente",
        tempo_desocupacao: "",
        data_ocupacao: "05/2015",
        data_ocupacao_irregular: "",
        obs_ocupado: "Ocupação regular para fins residenciais.",
        tipo_uso_atual: "0106",
        tipo_uso_especifico_atual: "Residencial",
        condicao_urbanizacao: "urbanizado",
        tipo_imovel: "casa",
        incidencia_ambiental: ["APP — Área de Preservação Permanente", "Área contaminada — passivo ambiental"],
        obs_incidencia_ambiental: "Próximo a rio, requer análise do IBAMA.",
        riscos: ["Risco de invasão/esbulho", "Risco à segurança/saúde pública"],
        obs_riscos: "Área com histórico de ocupações irregulares recentes.",
        restricoes: ["Faixa de fronteira", "Área Non Aedificandi"],
        obs_restricoes: "Dentro da faixa de 150km, requer assentimento prévio.",
        valor_avaliacao: "1.500.000,00",
        data_avaliacao: "10/05/2026",
        instrumento_avaliacao: "Laudo de Avaliação 045/2026",
        geo_cep: "70040-010",
        latitude: "-15.793889",
        longitude: "-47.882778",
        custos_manutencao: "Sim",
        estimativa_custos: "15.000,00",
        docs_custom_files_aba2_1: "",
        docs_custom_links_aba2_1: "https://extranet.spunet.gov.br/documentos/2026001_certidao_matricula.pdf",
        documentos_anexados: [
            {
                nome: "Certidão de Matrícula",
                url: "https://extranet.spunet.gov.br/documentos/2026001_certidao_matricula.pdf"
            }
        ]
    };
    
    dados = { ...dados, ...mockData };
    
    console.log("Atualizando Supabase...");
    // 3. Patch back
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/tabela_spu?numero_rip=eq.2026001`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ dados_json: dados })
    });
    
    if (patchRes.ok) {
        console.log("RIP 2026001 atualizado com sucesso!");
    } else {
        console.error("Erro ao atualizar", await patchRes.text());
    }
}

updateRIP();
