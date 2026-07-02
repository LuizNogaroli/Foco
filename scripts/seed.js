// scripts/seed.js
// Script para popular o banco de dados Supabase com 20 processos fictícios de simulação.
// Para rodar localmente: node scripts/seed.js

const url = "https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_drafts?on_conflict=process_id";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

const mockProcesses = [
    {
        process_id: "2494",
        form_data: {
            status: "Aguardando análise de admissibilidade", uf: "SE", municipio: "ARACAJU/SE",
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
            status: "Aguardando análise de admissibilidade", uf: "PA", municipio: "TUCURUÍ/PA",
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
            status: "Admissibilidade confirmada", uf: "SE", municipio: "ARACAJU/SE",
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
            status: "Em análise de admissibilidade", uf: "RS", municipio: "PELOTAS/RS",
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
            status: "Aguardando análise de admissibilidade", uf: "PR", municipio: "CAMPO MOURÃO/PR",
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
            status: "Admissibilidade confirmada", uf: "DF", municipio: "BRASÍLIA/DF",
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
            status: "Em análise de admissibilidade", uf: "SP", municipio: "SÃO PAULO/SP",
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
            status: "Aguardando análise de admissibilidade", uf: "RJ", municipio: "RIO DE JANEIRO/RJ",
            denominacao: "Área Adjacente Porto Maravilha", area: "8500.00", categoria: "Terreno",
            linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
            origem: "Datalake", campo11: "DF04403/2026", campo12: "15/01/2026",
            campo14: "42.345.678/0001-90", campo15: "CDURP - Região Portuária do Rio de Janeiro",
            _ripsPesquisados: {
                "33334444": { rip: "33334444", descricao: "Porto Maravilha Gleba A", municipio: "RIO DE JANEIRO/RJ", origem: "Datalake" }
            }
        }
    },
    {
        process_id: "2404",
        form_data: {
            status: "Admissibilidade confirmada", uf: "BA", municipio: "SALVADOR/BA",
            denominacao: "Terreno Marinha - Bairro Comércio", area: "3100.00", categoria: "Terreno",
            linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
            origem: "Cadastro SPUnet", campo11: "DF04404/2026", campo12: "20/01/2026",
            campo14: "13.456.789/0001-02", campo15: "Secretaria de Desenvolvimento Urbano da Bahia - SEDUR",
            _ripsPesquisados: {
                "44445555": { rip: "44445555", descricao: "Terreno Marinha Comércio", municipio: "SALVADOR/BA", origem: "Cadastro SPUnet" }
            }
        }
    },
    {
        process_id: "2405",
        form_data: {
            status: "Em análise de admissibilidade", uf: "MG", municipio: "BELO HORIZONTE/MG",
            denominacao: "Antiga Estação Ferroviária Leste", area: "15000.00", categoria: "Prédio",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "24.4 Equipamento comunitário/cultural",
            origem: "Portal de Serviços", campo11: "DF04405/2026", campo12: "25/01/2026",
            campo14: "00.375.442/0001-20", campo15: "Instituto Cultural Memorial de Minas Gerais",
            _ripsPesquisados: {
                "55556666": { rip: "55556666", descricao: "Estação Ferroviária Leste", municipio: "BELO HORIZONTE/MG", origem: "Portal de Serviços" }
            }
        }
    },
    {
        process_id: "2406",
        form_data: {
            status: "Aguardando análise de admissibilidade", uf: "SE", municipio: "ESTÂNCIA/SE",
            denominacao: "Gleba Praia do Saco", area: "45000.00", categoria: "Terreno",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "14.1 Ecoturismo/Lazer",
            origem: "Datalake", campo11: "DF04406/2026", campo12: "01/02/2026",
            campo14: "13.113.882/0001-44", campo15: "Associação de Ecoturismo da Praia do Saco",
            _ripsPesquisados: {
                "66667777": { rip: "66667777", descricao: "Gleba Praia do Saco", municipio: "ESTÂNCIA/SE", origem: "Datalake" }
            }
        }
    },
    {
        process_id: "2407",
        form_data: {
            status: "Em análise de admissibilidade", uf: "RS", municipio: "PORTO ALEGRE/RS",
            denominacao: "Galpão Docas do Cais do Porto", area: "6200.00", categoria: "Galpão",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "3.1 Unidade de atendimento",
            origem: "Portal de Serviços", campo11: "DF04407/2026", campo12: "05/02/2026",
            campo14: "92.758.123/0001-50", campo15: "Superintendência Portuária do Rio Grande do Sul",
            _ripsPesquisados: {
                "77778888": { rip: "77778888", descricao: "Galpão Docas Cais Porto", municipio: "PORTO ALEGRE/RS", origem: "Portal de Serviços" }
            }
        }
    },
    {
        process_id: "2408",
        form_data: {
            status: "Aguardando análise de admissibilidade", uf: "PR", municipio: "CURITIBA/PR",
            denominacao: "Terreno Bacacheri SPU", area: "890.00", categoria: "Terreno",
            linha_programa: "Linha 1 - Habitação de Interesse Social", utilizacao_especifica: "24.1 Provisão habitacional",
            origem: "Cadastro SPUnet", campo11: "DF04408/2026", campo12: "10/02/2026",
            campo14: "76.102.345/0001-06", campo15: "Companhia de Habitação Popular de Curitiba - COHAB",
            _ripsPesquisados: {
                "88889999": { rip: "88889999", descricao: "Terreno Bacacheri", municipio: "CURITIBA/PR", origem: "Cadastro SPUnet" }
            }
        }
    },
    {
        process_id: "2409",
        form_data: {
            status: "Admissibilidade confirmada", uf: "SP", municipio: "SANTOS/SP",
            denominacao: "Área Retroportuária Saboó", area: "35000.00", categoria: "Terreno",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "12.1 Logística/Transportes",
            origem: "Datalake", campo11: "DF04409/2026", campo12: "15/02/2026",
            campo14: "44.852.963/0001-11", campo15: "Autoridade Portuária de Santos - APS",
            _ripsPesquisados: {
                "99990000": { rip: "99990000", descricao: "Área Retroportuária Saboó", municipio: "SANTOS/SP", origem: "Datalake" }
            }
        }
    },
    {
        process_id: "2410",
        form_data: {
            status: "Em análise de admissibilidade", uf: "RJ", municipio: "NITERÓI/RJ",
            denominacao: "Forte Gragoatá Gleba SPU", area: "12000.00", categoria: "Outros",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "24.4 Equipamento comunitário/cultural",
            origem: "Portal de Serviços", campo11: "DF04410/2026", campo12: "20/02/2026",
            campo14: "28.521.902/0001-80", campo15: "Universidade Federal Fluminense - UFF",
            _ripsPesquisados: {
                "10101010": { rip: "10101010", descricao: "Forte Gragoatá Gleba", municipio: "NITERÓI/RJ", origem: "Portal de Serviços" }
            }
        }
    },
    {
        process_id: "2411",
        form_data: {
            status: "Admissibilidade confirmada", uf: "DF", municipio: "SOBRADINHO/DF",
            denominacao: "Gleba Reurb Setor de Chácaras", area: "75000.00", categoria: "Terreno",
            linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
            origem: "Cadastro SPUnet", campo11: "DF04411/2026", campo12: "22/02/2026",
            campo14: "12.345.678/0001-90", campo15: "CODHAB - Companhia de Desenvolvimento Habitacional do DF",
            _ripsPesquisados: {
                "20202020": { rip: "20202020", descricao: "Gleba Reurb Setor Chácaras", municipio: "SOBRADINHO/DF", origem: "Cadastro SPUnet" }
            }
        }
    },
    {
        process_id: "2412",
        form_data: {
            status: "Aguardando análise de admissibilidade", uf: "BA", municipio: "FEIRA DE SANTANA/BA",
            denominacao: "Prédio Antigo INSS SPU", area: "2400.00", categoria: "Prédio",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
            origem: "Portal de Serviços", campo11: "DF04412/2026", campo12: "25/02/2026",
            campo14: "29.979.036/0001-40", campo15: "Instituto Nacional do Seguro Social - INSS",
            _ripsPesquisados: {
                "30303030": { rip: "30303030", descricao: "Prédio Antigo INSS", municipio: "FEIRA DE SANTANA/BA", origem: "Portal de Serviços" }
            }
        }
    },
    {
        process_id: "2413",
        form_data: {
            status: "Em análise de admissibilidade", uf: "MG", municipio: "JUIZ DE FORA/MG",
            denominacao: "Gleba Industrial SPU Juiz de Fora", area: "18500.00", categoria: "Terreno",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "12.2 Indústria/Comércio",
            origem: "Datalake", campo11: "DF04413/2026", campo12: "01/03/2026",
            campo14: "18.324.900/0001-55", campo15: "Prefeitura Municipal de Juiz de Fora",
            _ripsPesquisados: {
                "40404040": { rip: "40404040", descricao: "Gleba Industrial Juiz de Fora", municipio: "JUIZ DE FORA/MG", origem: "Datalake" }
            }
        }
    },
    {
        process_id: "2414",
        form_data: {
            status: "Aguardando análise de admissibilidade", uf: "SE", municipio: "PROPRIÁ/SE",
            denominacao: "Gleba Margem Rio São Francisco", area: "900.00", categoria: "Terreno",
            linha_programa: "Linha 2 - Regularização Fundiária", utilizacao_especifica: "24.2 Regularização fundiária",
            origem: "Cadastro SPUnet", campo11: "DF04414/2026", campo12: "05/03/2026",
            campo14: "00.325.904/0001-77", campo15: "CODEVASF - Regional Sergipe",
            _ripsPesquisados: {
                "50505050": { rip: "50505050", descricao: "Gleba Margem Rio S. Francisco", municipio: "PROPRIÁ/SE", origem: "Cadastro SPUnet" }
            }
        }
    },
    {
        process_id: "2415",
        form_data: {
            status: "Admissibilidade confirmada", uf: "DF", municipio: "BRASÍLIA/DF",
            denominacao: "Sede SPU Bloco C Esplanada", area: "14500.00", categoria: "Prédio",
            linha_programa: "Linha 3 - Políticas públicas e programas estratégicos", utilizacao_especifica: "2.1 Sede/Unidade administrativa",
            origem: "Portal de Serviços", campo11: "DF04415/2026", campo12: "10/03/2026",
            campo14: "00.489.828/0001-33", campo15: "Ministério da Gestão e da Inovação em Serviços Públicos - MGI",
            _ripsPesquisados: {
                "60606060": { rip: "60606060", descricao: "Sede SPU Bloco C", municipio: "BRASÍLIA/DF", origem: "Portal de Serviços" }
            }
        }
    }
];

// Helper to complete RIP data structures in mock data
function completeMockRIPs(form_data) {
    if (!form_data._ripsPesquisados) return;
    for (let rip in form_data._ripsPesquisados) {
        const r = form_data._ripsPesquisados[rip];
        r.rip = r.rip || rip;
        r.descricao = r.descricao || form_data.denominacao || "Imóvel Patrimonial SPU";
        r.municipio = r.municipio || form_data.municipio || "Brasília/DF";
        r.uf = r.uf || form_data.uf || r.municipio.split('/')[1] || "DF";
        r.origem = r.origem || form_data.origem || "Portal de Serviços";
        r.cep = r.cep || (form_data.uf === "SE" ? "49001-000" : form_data.uf === "SP" ? "01001-000" : "70040-010");
        r.area_total = r.area_total || form_data.area || "1.200,00";
        r.valor_imovel = r.valor_imovel || form_data.valor || "500.000,00";
        r.logradouro = r.logradouro || "Endereço do Imóvel SPU, s/n";
        r.natureza = r.natureza || "Urbano";
        r.tipoImovel = r.tipoImovel || form_data.categoria || "Gleba/Terreno/Lote com edificação";
        r.benfeitorias = r.benfeitorias || "Sim";
    }
}

// Modify mock data to test multiple RIPs and no RIPs cases
mockProcesses.forEach(proc => {
    // 1. Processo SEI
    proc.form_data.campo13 = proc.form_data.campo13 || `10480.00${proc.process_id}/2026-${proc.process_id.substring(proc.process_id.length - 2)}`;
    
    // 2. Adjust specific cases
    if (proc.process_id === "2494") {
        proc.form_data._ripsPesquisados = {
            "78945612": { rip: "78945612", descricao: "Rancho Menezes, Gleba Itatá A", municipio: "ARACAJU/SE", origem: "Datalake" },
            "78945613": { rip: "78945613", descricao: "Rancho Menezes, Gleba Itatá B", municipio: "ARACAJU/SE", origem: "Datalake" }
        };
    } else if (proc.process_id === "2403") {
        proc.form_data._ripsPesquisados = {
            "33334444": { rip: "33334444", descricao: "Porto Maravilha Gleba A", municipio: "RIO DE JANEIRO/RJ", origem: "Datalake" },
            "33334445": { rip: "33334445", descricao: "Porto Maravilha Gleba B", municipio: "RIO DE JANEIRO/RJ", origem: "Datalake" }
        };
    } else if (proc.process_id === "2406" || proc.process_id === "2412") {
        delete proc.form_data._ripsPesquisados;
    }

    // 3. Complete RIP details
    completeMockRIPs(proc.form_data);
});

// Inject KPI/Management Dashboard Data
mockProcesses.forEach((proc, index) => {
    const fd = proc.form_data;
    const now = Date.now();
    const dayMs = 86400000;
    
    // Distribute statuses logically across the 20 processes
    if (index < 5) { 
        fd.status = "Viabilidade confirmada";
        fd.status_flow = "Encaminhar à Destinação";
    } else if (index < 8) { 
        fd.status = "Devolvido para complementação";
        fd.status_flow = "SPU/UF";
    } else if (index < 12) { 
        fd.status = "Em análise de viabilidade";
        fd.status_flow = "Direção"; 
    } else if (index < 15) { 
        fd.status = "Em análise de viabilidade";
        fd.status_flow = "CDE"; 
    } else { 
        fd.status = "Em análise de viabilidade";
        fd.status_flow = "SPU/UF";
    }

    // Add realistic SLA timestamps to generate chart data
    fd['foco_data_abertura'] = new Date(now - 40 * dayMs).toISOString();
    
    if (fd.status_flow === "Direção" || fd.status_flow === "CDE" || fd.status === "Viabilidade confirmada") {
        fd['foco_data_uf-super'] = new Date(now - 30 * dayMs).toISOString();
    }
    if (fd.status_flow === "CDE" || fd.status === "Viabilidade confirmada") {
        fd['foco_data_uc-diretoria'] = new Date(now - 15 * dayMs).toISOString();
    }
    if (fd.status === "Viabilidade confirmada") {
        fd['foco_data_cde'] = new Date(now - 5 * dayMs).toISOString();
    }
});
const urls = [
    "https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_origem?on_conflict=process_id",
    "https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_drafts?on_conflict=process_id"
];

async function run() {
    try {
        console.log("Iniciando carga de dados no Supabase...");

        const body = mockProcesses.map(proc => ({
            process_id: proc.process_id,
            form_data: proc.form_data,
            updated_at: new Date().toISOString()
        }));

        for (const url of urls) {
            const tableName = url.includes('foco_origem') ? 'foco_origem' : 'foco_drafts';
            console.log(`Povoando a tabela ${tableName}...`);
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': apikey,
                    'Authorization': `Bearer ${apikey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                console.log(`✅ Carga de dados realizada com sucesso na tabela ${tableName}!`);
            } else {
                const errText = await res.text();
                console.error(`❌ Erro ao popular a tabela ${tableName}:`, errText);
            }
        }
    } catch (e) {
        console.error("Erro inesperado no script:", e);
    }
}

run();
