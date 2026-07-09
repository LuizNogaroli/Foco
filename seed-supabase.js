const fs = require('fs');

const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

async function supabaseDelete(table) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?id=gt.0`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
}

async function supabaseInsert(table, payload) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
    });
}

async function seed() {
    console.log("Iniciando limpeza e seeding das tabelas via API REST...");
    
    // Limpa tabelas
    await supabaseDelete('portal_servicos');
    await supabaseDelete('datalake_spunet');
    
    let portalRows = [];
    let lakeRows = [];
    
    const ufs_municipios = [
        { uf: 'DF', mun: 'BRASÍLIA/DF' },
        { uf: 'SP', mun: 'SÃO PAULO/SP' },
        { uf: 'SP', mun: 'SANTOS/SP' },
        { uf: 'RJ', mun: 'RIO DE JANEIRO/RJ' },
        { uf: 'RJ', mun: 'NITERÓI/RJ' },
        { uf: 'MG', mun: 'BELO HORIZONTE/MG' },
        { uf: 'BA', mun: 'SALVADOR/BA' },
        { uf: 'CE', mun: 'FORTALEZA/CE' },
        { uf: 'PE', mun: 'RECIFE/PE' },
        { uf: 'RS', mun: 'PORTO ALEGRE/RS' },
        { uf: 'PR', mun: 'CURITIBA/PR' },
        { uf: 'SC', mun: 'FLORIANÓPOLIS/SC' },
        { uf: 'AM', mun: 'MANAUS/AM' },
        { uf: 'PA', mun: 'BELÉM/PA' }
    ];

    const interessados = [
        'Prefeitura Municipal',
        'Governo do Estado',
        'Universidade Federal',
        'Instituto de Pesquisa',
        'Associação de Moradores',
        'ONG Ambiental',
        'Marinha do Brasil',
        'Polícia Federal',
        'Ministério da Saúde',
        'Secretaria de Educação'
    ];

    for(let i=1; i<=20; i++) {
        const loc = ufs_municipios[Math.floor(Math.random() * ufs_municipios.length)];
        const inter = interessados[Math.floor(Math.random() * interessados.length)] + ' ' + String.fromCharCode(64 + i);
        const seq = String(i).padStart(3, '0'); // XXX
        const reqNum = loc.uf + '2026' + seq; // UF2026XXX

        // Linha do Portal de Serviços
        portalRows.push({
            process_id: String(i),
            form_data: {
                origem: 'Portal de Serviços',
                campo11: reqNum,
                campo12: (i < 10 ? '0'+i : i) + '/01/2026',
                campo13: '10480.00' + (2400 + i) + '/2026-66',
                campo14: '12.345.678/0001-' + (10 + i),
                campo15: inter,
                campo19: '(11) 98765-4321',
                uf: loc.uf,
                municipio: loc.mun,
                procedimento: 'Cessão Onerosa',
                representante_legal: {
                    cpf_cnpj: 'Opcional',
                    nome: 'Opcional',
                    telefone: '(99) 99999-9999'
                },
                documentos_anexados: [
                    { nome: "Requerimento inicial", url: "PDF_1_Nononononononono.pdf" },
                    { nome: "Contrato social", url: "PDF_2_Nononononononono.pdf" }
                ]
            }
        });

        const dadosImovel = {
            cep: (70000 + i) + '-000', // Mock de CEP
            natureza: 'Terreno',
            tipo_imovel: 'Dominial',
            conceituacao: 'Terreno de marinha e acrescido',
            area_total: '1000m²',
            area_uniao: '1000m²',
            benfeitorias: 'Sim',
            area_construida_total: '250m²',
            area_terreno_disponivel: '750m²',
            area_construida_disponivel: '250m²',
            valor_avaliado: '1.000.000,00',
            data_avaliacao: '15/03/2025',
            instrumento_avaliacao: 'Laudo Técnico SPU',
            situacao_incorporacao: 'Incorporado',
            lpm_homologada: 'Sim',
            processo_incorporacao: 'Sim',
            numero_processo: '10480.' + (1000 + i) + '/2020-00',
            cartorio: '1º Ofício de Registro de Imóveis',
            numero_matricula: '123' + i,
            endereco: 'Rua Mockada ' + i + ', Centro',
            uf: loc.uf,
            municipio: loc.mun
        };

        // Seleciona 1 ou 2 campos para deixar em branco (simulando falha/falta de dado no Datalake)
        // Não apagamos UF, Municipio, Endereço, Natureza ou CEP para não quebrar a identificação básica
        const chavesParaApagar = Object.keys(dadosImovel).filter(k => !['uf', 'municipio', 'endereco', 'natureza', 'cep'].includes(k));
        const qtdApagar = Math.floor(Math.random() * 2) + 1; // 1 ou 2
        
        for (let j = 0; j < qtdApagar; j++) {
            const indexAleatorio = Math.floor(Math.random() * chavesParaApagar.length);
            const chaveEscolhida = chavesParaApagar[indexAleatorio];
            dadosImovel[chaveEscolhida] = ''; // Deixa o campo vazio
            chavesParaApagar.splice(indexAleatorio, 1); // Evita escolher o mesmo novamente
        }

        // Linha correspondente no Datalake SPUnet
        lakeRows.push({
            rip: '2026' + seq, // 2026XXX
            dados_imovel: dadosImovel
        });
    }

    console.log("Inserindo 20 processos em portal_servicos...");
    for (const row of portalRows) {
        await supabaseInsert('portal_servicos', row);
    }
    
    console.log("Inserindo 20 RIPs em datalake_spunet...");
    for (const row of lakeRows) {
        await supabaseInsert('datalake_spunet', row);
    }

    console.log("Seeding concluído com sucesso!");
}

seed().catch(console.error);
