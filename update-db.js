const fs = require('fs');

const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

const baseMock = {
    conceituacao: 'Gleba simulada',
    natureza: 'Urbano',
    tipo_imovel: 'Terreno',
    cep: '00000-000',
    uf: 'NA',
    municipio: 'BRASÍLIA/DF',
    endereco: 'Endereço Simulado, s/n',
    area_total: '5000.00',
    area_uniao: '5000.00',
    benfeitorias: 'Sim',
    area_construida_total: '2.400,00',
    area_terreno_disponivel: '2.400,00',
    area_construida_disponivel: '2.400,00',
    valor_avaliado: '500.000,00',
    data_avaliacao: '13/05/2026',
    instrumento_avaliacao: 'Laudo Técnico SPU',
    situacao_incorporacao: 'Em processo de incorporação',
    lpm_homologada: 'Sim',
    processo_incorporacao: 'Sim',
    numero_processo: '1234.56790/2026-00',
    matricula: '123.456 - 1ª CRI SP'
};

async function fixTable(tableName) {
    const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
    
    const res = await fetch(url, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    
    const rows = await res.json();
    if (!Array.isArray(rows)) return;
    
    for (let row of rows) {
        let changed = false;
        if (row.form_data && row.form_data._ripsPesquisados) {
            for (let rip in row.form_data._ripsPesquisados) {
                const r = row.form_data._ripsPesquisados[rip];
                for (let k in baseMock) {
                    if (!r[k]) {
                        r[k] = baseMock[k];
                        changed = true;
                    }
                }
            }
        }
        
        if (changed) {
            const updateUrl = `${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${row.id}`;
            await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ form_data: row.form_data })
            });
            console.log(`Updated ${tableName} id ${row.id}`);
        }
    }
}

async function run() {
    await fixTable('foco_origem');
    await fixTable('foco_drafts');
    await fixTable('foco_final');
    console.log("All tables updated!");
}

run();
