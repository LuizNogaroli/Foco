const fs = require('fs');

let idx = fs.readFileSync('index.html', 'utf8');

// 1. HTML Headers
idx = idx.replace('<th style="width: 140px;">RIP Associado</th>\r\n', '');
idx = idx.replace('<th style="width: 140px;">RIP Associado</th>\n', '');
idx = idx.replace('<th style="width: 140px;">RIP Associado</th>', '');

idx = idx.replace('<th style="width: 180px;">Uso Imobiliário</th>\r\n', '');
idx = idx.replace('<th style="width: 180px;">Uso Imobiliário</th>\n', '');
idx = idx.replace('<th style="width: 180px;">Uso Imobiliário</th>', '');

idx = idx.replace('<th style="width: 170px;">Regime de Destinação</th>', '<th style="width: 170px;">Regime requerido</th>');


// 2. JS: fetchProcesses
const fetchOld = /async function fetchProcesses\(\) \{[\s\S]*?\/\/ Helper para ordenar a tabela/;
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
                const urlPortal = 'https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/portal_servicos?select=*&order=id.desc';
                const urlDrafts = 'https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_drafts?select=*';
                const options = {
                    method: 'GET',
                    headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU'
                    }
                };

                const [resPortal, resDrafts] = await Promise.all([
                    fetch(urlPortal, options),
                    fetch(urlDrafts, options)
                ]);

                if (!resPortal.ok) throw new Error('Falha ao buscar portal_servicos');
                const dataPortal = await resPortal.json();
                
                let dataDrafts = [];
                if (resDrafts.ok) {
                    dataDrafts = await resDrafts.json();
                }

                // Create a map of drafts by process_id
                const draftMap = {};
                dataDrafts.forEach(d => {
                    draftMap[d.process_id] = d.form_data || {};
                });

                const processes = dataPortal.map(row => {
                    const portal = row.form_data || {};
                    const draft = draftMap[row.process_id] || {};

                    const uf = portal.uf || portal.uf_sem_rip || portal['imoveis[0][uf]'] || portal['imoveis[1][uf]'] || '-';
                    const municipio = portal.municipio || portal.municipio_sem_rip || portal['imoveis[0][municipio]'] || portal['imoveis[1][municipio]'] || '-';

                    return {
                        id: row.process_id,
                        requerimento: portal.campo11 || '-',
                        data_req: portal.campo12 || '-',
                        uf: uf,
                        municipio: municipio,
                        sei: portal.campo13 || '-',
                        interessado: portal.campo15 || '-',
                        
                        // Regime requerido (pode vir do procedimento no portal)
                        procedimento: portal.procedimento || 'Cessão Onerosa',
                        
                        // Checkpoint SPU/UF
                        checkpoint: uf !== '-' ? 'SPU/' + uf : 'SPU/BR',

                        // Dados Operacionais (Vêm do foco_drafts, caso não existam caem no fallback)
                        status: draft.status || 'Aguardando Análise',
                        atribuido_para: draft.atribuido_para || '',
                        prioridade: portal.prioridade_legal && portal.prioridade_legal !== 'Não se aplica' ? true : false,
                    };
                });
                
                allProcesses = processes;
                applyFilters();
            } catch (err) {
                console.error('Erro ao buscar dados do Supabase:', err);
            } finally {
                hideLoader();
            }
        }

        // Helper para ordenar a tabela`;

idx = idx.replace(fetchOld, fetchNew);


// 3. JS: renderTable
const renderOld = /const ripKeys = Object\.keys\(proc\.rips\);[\s\S]*?<td>\$\{statusFlowHtml\}<\/td>/;
const renderNew = `let statusFlowHtml = \`<span style="font-weight: 700; color: #1e3a5f; background-color: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 11px;">\${proc.checkpoint}</span>\`;

                tr.innerHTML = \`
                    <td><b>\${proc.requerimento}</b></td>
                    <td>\${proc.data_req}</td>
                    <td>\${proc.uf}</td>
                    <td>\${proc.municipio}</td>
                    <td>
                        <div style="font-weight: 600;">\${proc.interessado}</div>
                    </td>
                    <td><span style="font-family: monospace; font-size:11.5px;">\${proc.sei}</span></td>
                    <td>\${proc.procedimento}</td>
                    <td>\${statusFlowHtml}</td>`;

idx = idx.replace(renderOld, renderNew);

// Fix colspan in empty state
idx = idx.replace('<td colspan="11" class="empty-state">', '<td colspan="9" class="empty-state">');


// 4. JS: applyFilters
const filterOld = /const matchUso = !uso \|\| proc\.tipo_uso\.toLowerCase\(\)\.includes\(uso\);[\s\S]*?const matchRipQuery = !ripQuery \|\| ripKeys\.includes\(ripQuery\);[\s\S]*?ripKeys\.includes\(query\) \|\|/;
const filterNew = `// Filters removed for RIP and Uso
                const matchQuery = !query || 
                                   proc.id.toLowerCase().includes(query) || 
                                   proc.interessado.toLowerCase().includes(query) || 
                                   proc.sei.toLowerCase().includes(query) || 
`;
idx = idx.replace(filterOld, filterNew);

idx = idx.replace('return matchUf && matchMuni && matchStatus && matchInteressado && matchSei && matchRipQuery && matchUso && matchQuery;', 'return matchUf && matchMuni && matchStatus && matchInteressado && matchSei && matchQuery;');


fs.writeFileSync('index.html', idx);
console.log('Patch concluded.');
