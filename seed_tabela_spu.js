const fs = require('fs');

const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

const reqs = [
    { num: '2026001', uf: 'PR', mun: 'CURITIBA/PR', nat: 'Terreno de marinha e acrescido' },
    { num: '2026002', uf: 'DF', mun: 'BRASÍLIA/DF', nat: 'Terreno Nacional Interior' },
    { num: '2026003', uf: 'RJ', mun: 'NITERÓI/RJ', nat: 'Terreno de marinha e acrescido' },
    { num: '2026004', uf: 'RJ', mun: 'NITERÓI/RJ', nat: 'Terreno Nacional Interior' },
    { num: '2026005', uf: 'PR', mun: 'CURITIBA/PR', nat: 'Imóvel de Domínio da União' },
    { num: '2026006', uf: 'PR', mun: 'CURITIBA/PR', nat: 'Terreno Nacional Interior' },
    { num: '2026007', uf: 'AM', mun: 'MANAUS/AM', nat: 'Ilha fluvial ou lacustre' },
    { num: '2026008', uf: 'SP', mun: 'SANTOS/SP', nat: 'Terreno de marinha e acrescido' },
    { num: '2026009', uf: 'RS', mun: 'PORTO ALEGRE/RS', nat: 'Imóvel de Domínio da União' },
    { num: '2026010', uf: 'CE', mun: 'FORTALEZA/CE', nat: 'Terreno de marinha e acrescido' },
    { num: '2026011', uf: 'DF', mun: 'BRASÍLIA/DF', nat: 'Terreno Nacional Interior' },
    { num: '2026012', uf: 'SP', mun: 'SÃO PAULO/SP', nat: 'Terreno Nacional Interior' },
    { num: '2026013', uf: 'MG', mun: 'BELO HORIZONTE/MG', nat: 'Gleba destinada a assentamento' },
    { num: '2026014', uf: 'DF', mun: 'BRASÍLIA/DF', nat: 'Terreno Nacional Interior' },
    { num: '2026015', uf: 'RS', mun: 'PORTO ALEGRE/RS', nat: 'Terreno Nacional Interior' },
    { num: '2026016', uf: 'DF', mun: 'BRASÍLIA/DF', nat: 'Terreno Nacional Interior' },
    { num: '2026017', uf: 'DF', mun: 'BRASÍLIA/DF', nat: 'Terreno Nacional Interior' },
    { num: '2026018', uf: 'MG', mun: 'BELO HORIZONTE/MG', nat: 'Imóvel de Domínio da União' },
    { num: '2026019', uf: 'PA', mun: 'BELÉM/PA', nat: 'Terreno de marinha e acrescido' },
    { num: '2026020', uf: 'SC', mun: 'FLORIANÓPOLIS/SC', nat: 'Ilha oceânica ou costeira' },
];

async function insertRips() {
    console.log('Iniciando inserção de RIPs na tabela_spu...');
    let inseridos = 0;
    
    for (const req of reqs) {
        const payload = {
            numero_rip: req.num,
            dados_json: {
                conceituacao: "Área de domínio da União sob administração da SPU",
                condicao_urbanizacao: "Área urbana consolidada",
                natureza_terreno: req.nat,
                tipo_imovel: "Terreno com benfeitorias",
                cep: "70000-000",
                uf: req.uf,
                municipio: req.mun,
                logradouro: `Endereço genérico em ${req.mun}, nº ${parseInt(req.num) % 100}`,
                area_total: 1000 + (parseInt(req.num) % 10) * 500,
                area_uniao: 1000 + (parseInt(req.num) % 10) * 500,
                benfeitorias: "Sim",
                area_construida_total: 300 + (parseInt(req.num) % 5) * 100,
                area_construida_disponivel: 150 + (parseInt(req.num) % 5) * 50,
                area_terreno_disponivel: 500 + (parseInt(req.num) % 5) * 100,
                situacao_incorporacao: "Incorporado",
                valor_avaliado: "R$ 1.500.000,00",
                data_avaliacao: "15/05/2026",
                instrumento_avaliacao: "Laudo de Avaliação NBR 14653",
                lpm_homologada: "Sim",
                processo_incorporacao: "10480.123456/2020-11",
                docs_custom_files_aba2_1: "",
                docs_custom_links_aba2_1: `https://extranet.spunet.gov.br/documentos/${req.num}_certidao_matricula.pdf`,
                contratos_anteriores: [
                    {
                        numero: `Contrato nº ${100 + (parseInt(req.num) % 100)}/2020`,
                        data_inicio: "01/01/2020",
                        data_fim: "31/12/2022"
                    },
                    {
                        numero: `Contrato nº ${200 + (parseInt(req.num) % 100)}/2023`,
                        data_inicio: "01/01/2023",
                        data_fim: "31/12/2025"
                    }
                ],
                documentos_anexados: [
                    {
                        nome: "Certidão de Matrícula",
                        url: `https://extranet.spunet.gov.br/documentos/${req.num}_certidao_matricula.pdf`
                    }
                ]
            }
        };

        const url = `${SUPABASE_URL}/rest/v1/tabela_spu`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                inseridos++;
                console.log(`RIP ${req.num} inserido.`);
            } else {
                console.error(`Falha ao inserir RIP ${req.num}: ${response.statusText}`);
            }
        } catch (e) {
            console.error(`Erro:`, e);
        }
    }
    console.log(`Total de RIPs inseridos: ${inseridos}`);
}

insertRips();
