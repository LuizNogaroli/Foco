const fs = require('fs');

// PATCH INDEX.HTML
let idx = fs.readFileSync('index.html', 'utf8');

// Change loader text
idx = idx.replace(/Sincronizando dados com o Portal de Servi[çc]os/, 'Carregando dados...');
idx = idx.replace(/Preparando o seu ambiente de trabalho seguro\./, '');

// Change fetchProcesses
const fetchOld = /async function fetchProcesses\(\) \{[\s\S]*?const tableBody = document\.getElementById\('tableBody'\);[\s\S]*?hideLoader\(\);\s*\}/;
const fetchNew = `async function fetchProcesses() {
            const startTime = Date.now();
            const tableBody = document.getElementById('tableBody');
            
            function hideLoader() {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 1500 - elapsedTime);
                setTimeout(() => {
                    const loader = document.getElementById('dashboard-loading-overlay');
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => { loader.remove(); }, 400);
                    }
                }, remainingTime);
            }

            try {
                if (!window.supabaseClient) throw new Error('Supabase Client not found');
                const { data, error } = await window.supabaseClient.from('portal_servicos').select('*').order('id', { ascending: false });
                if (error) throw error;
                
                // Map the data back to the format expected by the frontend table logic
                const processes = data.map(row => {
                    return {
                        id: row.process_id,
                        requerimento: row.form_data.campo11 || '-',
                        data_req: row.form_data.campo12 || '-',
                        uf: row.form_data.uf || row.form_data.uf_sem_rip || row.form_data['imoveis[0][uf]'] || row.form_data['imoveis[1][uf]'] || '-',
                        municipio: row.form_data.municipio || row.form_data.municipio_sem_rip || row.form_data['imoveis[0][municipio]'] || row.form_data['imoveis[1][municipio]'] || '-',
                        sei: row.form_data.campo13 || '-',
                        interessado: row.form_data.campo15 || '-',
                        status: row.form_data.status || 'Aguardando Análise',
                        prioridade: row.form_data.prioridade_legal && row.form_data.prioridade_legal !== 'Não se aplica' ? true : false,
                        rips: [],
                        uso_atual: ''
                    };
                });
                
                window.globalProcesses = processes;
                applyFiltersAndRender();
            } catch (err) {
                console.error('Erro ao buscar dados do Supabase:', err);
            } finally {
                hideLoader();
            }
        }`;

idx = idx.replace(fetchOld, fetchNew);
fs.writeFileSync('index.html', idx);


// PATCH FOCO-01.JS
let foco01 = fs.readFileSync('foco-01.js', 'utf8');
const searchOld = /const dados = \(window\.parent && window\.parent\.datalakeSpunet\) \? window\.parent\.datalakeSpunet\[rip\] : \(window\.datalakeSpunet \|\| \{\}\)\[rip\];[\s\S]*?if \(dados\) \{[\s\S]*?input\.value = '';\s*\}\s*else \{[\s\S]*?alert\('RIP ' \+ rip \+ ' n[aã]o encontrado na base de dados[\s\S]*?\}\s*\}/;

const searchNew = `
    const { data, error } = await window.parent.supabaseClient.from('datalake_spunet').select('dados_imovel').eq('rip', rip).single();
    
    if (error || !data || !data.dados_imovel) {
        alert('RIP ' + rip + ' não encontrado na base de dados (Datalake SPUnet).');
    } else {
        const dados = data.dados_imovel;
        window.ripsPesquisados[rip] = dados;
        window.adicionarTagRIP(rip, dados);
        window.criarBlocoImovel(rip, dados);
        window.atualizarRipsOcultos();
        input.value = '';
    }
}
`;

foco01 = foco01.replace(/window\.pesquisarRip = function/g, 'window.pesquisarRip = async function');
foco01 = foco01.replace(searchOld, searchNew);
fs.writeFileSync('foco-01.js', foco01);
